package umm3601.host;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;

@SuppressWarnings({ "MagicNumber" })
public class HostControllerSpec {

  private HostController hostController;

  private ObjectId frysId;
  private ObjectId huntId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Host>> hostArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskArrayListCaptor;

  @Captor
  private ArgumentCaptor<Host> hostCaptor;

  @Captor
  private ArgumentCaptor<Hunt> huntCaptor;

  @Captor
  private ArgumentCaptor<Task> taskCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        .build());
      db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    MockitoAnnotations.openMocks(this);

    MongoCollection<Document> hostDocuments = db.getCollection("hosts");
    hostDocuments.drop();
    frysId = new ObjectId();
    Document fry = new Document()
      .append("_id", frysId)
      .append("name", "Fry")
      .append("userName", "fry")
      .append("email", "fry@email");

    hostDocuments.insertOne(fry);

    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt")
        .append("description", "Fry's hunt for the seven leaf clover")
        .append("est", 20)
        .append("numberOfTasks", 5));
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt 2")
        .append("description", "Fry's hunt for Morris")
        .append("est", 30)
        .append("numberOfTasks", 2));
    testHunts.add(
      new Document()
        .append("hostId", "frysId")
        .append("name", "Fry's Hunt 3")
        .append("description", "Fry's hunt for money")
        .append("est", 40)
        .append("numberOfTasks", 1));

        huntId = new ObjectId();
    Document hunt = new Document()
      .append("_id", huntId)
      .append("hostId", "frysId")
      .append("name", "Best Hunt")
      .append("description", "This is the best hunt")
      .append("est", 20)
      .append("numberOfTasks", 3);

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(hunt);

    MongoCollection<Document> taskDocuments = db.getCollection("tasks");
    taskDocuments.drop();
    List<Document> testTasks = new ArrayList<>();
    testTasks.add(
      new Document()
        .append("huntId", "huntId")
        .append("name", "Take a picture of a cat")
        .append("status", false));
    testTasks.add(
      new Document()
        .append("huntId", "huntId")
        .append("name", "Take a picture of a dog")
        .append("status", false));
    testTasks.add(
      new Document()
        .append("huntId", "huntId")
        .append("name", "Take a picture of a park")
        .append("status", true));

    taskDocuments.insertMany(testTasks);

    hostController = new HostController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    hostController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

  @Test
  void canGetAllHunts() throws IOException {

    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    hostController.getHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
        db.getCollection("hunts").countDocuments(),
        huntArrayListCaptor.getValue().size());
  }

  @Test
  void getHuntsByHostId() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("hostId", Collections.singletonList("frysId"));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass("hostId", String.class))
    .thenReturn(Validator.create(String.class, "frysId", "hostId"));

    hostController.getHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(4, huntArrayListCaptor.getValue().size());
    for (Hunt hunt : huntArrayListCaptor.getValue()) {
      assertEquals("frysId", hunt.hostId);
    }
  }

  @Test
  void getHuntById() throws IOException {
    String id = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    hostController.getHunt(ctx);

    verify(ctx).json(huntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("Best Hunt", huntCaptor.getValue().name);
    assertEquals(huntId.toHexString(), huntCaptor.getValue()._id);
  }

   @Test
  void addHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "Newly made hunt",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    hostController.addNewHunt(ctx);
    verify(ctx).json(mapCaptor.capture());

    verify(ctx).status(HttpStatus.CREATED);

    Document addedHunt = db.getCollection("hunts")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    assertNotEquals("", addedHunt.get("_id"));
    assertEquals("New Hunt", addedHunt.get("name"));
    assertEquals("frysId", addedHunt.get(HostController.HOST_KEY));
    assertEquals("Newly made hunt", addedHunt.get("description"));
    assertEquals(45, addedHunt.get("est"));
    assertEquals(3, addedHunt.get("numberOfTasks"));
  }

  @Test
  void addInvalidNoNameHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "",
          "description": "Newly made hunt",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidLongNameHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "This should be a name that is too long to be valid hopefully",
          "description": "Newly made hunt",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidHostIdHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "",
          "name": "New Hunt",
          "description": "Newly made hunt",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidHostNullIdHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": null,
          "name": "New Hunt",
          "description": "Newly made hunt",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidDescriptionHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "This description has to be longer than two hundred characters so that it is invalid
          when it tries to make a hunt. I really hope that this is long enough otherwise I have to type more.
          Well it wasn't long enough so now I'm typing again and getting kind of sick of it.",
          "est": 45,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidESTHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "This is a great hunt",
          "est": 300,
          "numberOfTasks": 3
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void addInvalidNumberOfTasksHunt() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "This is a great hunt",
          "est": 30,
          "numberOfTasks":
        }
        """;
    when(ctx.bodyValidator(Hunt.class))
        .then(value -> new BodyValidator<Hunt>(testNewHunt, Hunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewHunt(ctx);
    });
  }

  @Test
  void canGetAllTasks() throws IOException {

    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    hostController.getTasks(ctx);

    verify(ctx).json(taskArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
        db.getCollection("tasks").countDocuments(),
        taskArrayListCaptor.getValue().size());
  }
}
