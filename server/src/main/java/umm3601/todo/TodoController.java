package umm3601.todo;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import umm3601.Controller;

import java.util.ArrayList;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

public class TodoController implements Controller {

  private static final String API_TODOS = "/api/todos";
  private static final String API_TODO_BY_ID = "/api/todos/{id}";
  private final String Todo_Key = "todoId";
  private static final String API_HUNTS = "/api/hunts";

  private final JacksonMongoCollection<Todo> todoCollection;
  private final JacksonMongoCollection<Hunt> huntCollection;

  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(
      database,
      "todos",
      Todo.class,
       UuidRepresentation.STANDARD);
    huntCollection = JacksonMongoCollection.builder().build(
      database,
      "hunts",
      Hunt.class,
       UuidRepresentation.STANDARD);
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

  private Bson constructSortingOrder(Context ctx) {
    Bson sortingOrder = Sorts.ascending("name");
    return sortingOrder;
  }

  private Bson constructFilter(Context ctx) {
    Bson filter = new Document();
    return filter;
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_HUNTS, this::getHunts);
  }

}
