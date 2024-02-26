package umm3601.host;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import umm3601.Controller;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

public class HostController implements Controller {

  private static final String API_HOSTS = "/api/hosts";
  private static final String API_HOST_BY_ID = "/api/hosts/{id}";
  static final String HOST_KEY = "hostId";
  private static final String API_HUNTS = "/api/hunts";

  private static final int REASONABLE_NAME_LENGTH = 50;
  private static final int REASONABLE_DESCRIPTION_LENGTH = 200;
  private static final int REASONABLE_EST_LENGTH = 240;

  private final JacksonMongoCollection<Host> hostCollection;
  private final JacksonMongoCollection<Hunt> huntCollection;

  public HostController(MongoDatabase database) {
    hostCollection = JacksonMongoCollection.builder().build(
      database,
      "hosts",
      Host.class,
       UuidRepresentation.STANDARD);
    huntCollection = JacksonMongoCollection.builder().build(
      database,
      "hunts",
      Hunt.class,
       UuidRepresentation.STANDARD);
  }

  public void getHunt(Context cts) {
    String id = cts.pathParam("id");
    Hunt hunt;

    try {
      hunt = huntCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested hunt id wasn't a legal Mongo Object ID.");
    }
    if (hunt == null) {
      throw new BadRequestResponse("The requested hunt was not found");
    } else {
      cts.json(hunt);
      cts.status(HttpStatus.OK);
    }
  }

  public void getHunts(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<Hunt> matchingHunts = huntCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    ctx.json(matchingHunts);

    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>();

    if (ctx.queryParamMap().containsKey(HOST_KEY)) {
      String targetHost = ctx.queryParamAsClass(HOST_KEY, String.class).get();
      filters.add(eq(HOST_KEY, targetHost));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "name");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void addNewHunt(Context ctx) {
    Hunt newHunt = ctx.bodyValidator(Hunt.class)
    .check(hunt -> hunt.hostId != null && hunt.hostId.length() > 0, "Invalid hostId")
    .check(hunt -> hunt.name.length() < REASONABLE_NAME_LENGTH, "Name must be less than 50 characters")
    .check(hunt -> hunt.name.length() > 0, "Name must be at least 1 character")
    .check(hunt -> hunt.description.length() < REASONABLE_DESCRIPTION_LENGTH,
     "Description must be less than 200 characters")
    .check(hunt -> hunt.description.length() > 0, "Description must be at least 1 character")
    .check(hunt -> hunt.est < REASONABLE_EST_LENGTH, "Estimated time must be less than 4 hours")
    .get();

    huntCollection.insertOne(newHunt);
    ctx.json(Map.of("id", newHunt._id));
    ctx.status(HttpStatus.CREATED);
  }

  @Override
  public void addRoutes(Javalin server) {

    server.get(API_HUNTS, this::getHunts);

    server.post(API_HUNTS, this::addNewHunt);
  }

}
