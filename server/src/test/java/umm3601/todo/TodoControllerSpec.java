package umm3601.todo;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import io.javalin.validation.Validator;
import umm3601.host.Hunt;
import umm3601.host.Host;
import umm3601.host.HostController;

@SuppressWarnings({ "MagicNumber" })
public class TodoControllerSpec {

  private HostController todoController;

  private ObjectId frysId;
  private ObjectId huntId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Host>> todoArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<Host> todoCaptor;

  @Captor
  private ArgumentCaptor<Hunt> huntCaptor;

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

    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    frysId = new ObjectId();
    Document fry = new Document()
      .append("_id", frysId)
      .append("name", "Fry")
      .append("userName", "fry")
      .append("email", "fry@email");

    todoDocuments.insertOne(fry);

    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
      new Document()
        .append("todoId", "frysId")
        .append("name", "Fry's Hunt")
        .append("description", "Fry's hunt for the seven leaf clover")
        .append("est", 20)
        .append("tasks", Arrays.asList(
          new ObjectId(),
          new ObjectId(),
          new ObjectId()
        )));
    testHunts.add(
      new Document()
        .append("todoId", "frysId")
        .append("name", "Fry's Hunt 2")
        .append("description", "Fry's hunt for Morris")
        .append("est", 30)
        .append("tasks", Arrays.asList(
          new ObjectId(),
          new ObjectId(),
          new ObjectId()
        )));
    testHunts.add(
      new Document()
        .append("todoId", "frysId")
        .append("name", "Fry's Hunt 3")
        .append("description", "Fry's hunt for money")
        .append("est", 40)
        .append("tasks", Arrays.asList(
          new ObjectId(),
          new ObjectId(),
          new ObjectId()
        )));

        huntId = new ObjectId();
    Document hunt = new Document()
      .append("_id", huntId)
      .append("todoId", "frysId")
      .append("name", "Best Hunt")
      .append("description", "This is the best hunt")
      .append("est", 20)
      .append("tasks", Arrays.asList(
        new ObjectId(),
        new ObjectId(),
        new ObjectId()
      ));

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(hunt);

    todoController = new HostController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    todoController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

  @Test
  void canGetAllHunts() throws IOException {

    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    todoController.getHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(
        db.getCollection("hunts").countDocuments(),
        huntArrayListCaptor.getValue().size());
  }

  @Test
  void getTodosWithCategorySoftwareDesign() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put("todoId", Collections.singletonList("frysId"));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass("todoId", String.class))
    .thenReturn(Validator.create(String.class, "frysId", "todoId"));

    todoController.getHunts(ctx);

    verify(ctx).json(huntArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals(4, huntArrayListCaptor.getValue().size());
    for (Hunt hunt : huntArrayListCaptor.getValue()) {
      assertEquals("frysId", hunt.todoId);
    }
  }

  @Test
  void getHuntById() throws IOException {
    String id = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    todoController.getHunt(ctx);

    verify(ctx).json(huntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("Best Hunt", huntCaptor.getValue().name);
    assertEquals(huntId.toHexString(), huntCaptor.getValue()._id);
  }
}
