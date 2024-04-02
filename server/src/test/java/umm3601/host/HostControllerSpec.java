package umm3601.host;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
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
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.UploadedFile;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;

@SuppressWarnings({ "MagicNumber" })
class HostControllerSpec {
  private HostController hostController;
  private ObjectId frysId;
  private ObjectId huntId;
  private ObjectId taskId;
  private ObjectId startedHuntId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskArrayListCaptor;

  @Captor
  private ArgumentCaptor<Host> hostCaptor;

  @Captor
  private ArgumentCaptor<CompleteHunt> completeHuntCaptor;

  @Captor
  private ArgumentCaptor<StartedHunt> startedHuntCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<StartedHunt>> startedHuntArrayListCaptor;

  @Captor
  private ArgumentCaptor<FinishedHunt> finishedHuntCaptor;

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
    testHunts.add(
        new Document()
            .append("hostId", "differentId")
            .append("name", "Different's Hunt")
            .append("description", "Different's hunt for money")
            .append("est", 60)
            .append("numberOfTasks", 10));

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
        .append("huntId", huntId.toHexString())
        .append("name", "Take a picture of a cat")
        .append("status", false)
        .append("photos", new ArrayList<String>()));
    testTasks.add(
      new Document()
        .append("huntId", huntId.toHexString())
        .append("name", "Take a picture of a dog")
        .append("status", false)
        .append("photos", new ArrayList<String>()));

    testTasks.add(
        new Document()
            .append("huntId", huntId.toHexString())
            .append("name", "Take a picture of a park")
            .append("status", true)
            .append("photos", new ArrayList<String>()));
    testTasks.add(
        new Document()
            .append("huntId", "differentId")
            .append("name", "Take a picture of a moose")
            .append("status", true)
            .append("photos", new ArrayList<String>()));

    taskId = new ObjectId();
    Document task = new Document()
        .append("_id", taskId)
        .append("huntId", "someId")
        .append("name", "Best Task")
        .append("status", false)
        .append("photos", new ArrayList<String>());

    taskDocuments.insertMany(testTasks);
    taskDocuments.insertOne(task);

    MongoCollection<Document> startedHuntsDocuments = db.getCollection("startedHunts");
    startedHuntsDocuments.drop();
    List<Document> startedHunts = new ArrayList<>();
    startedHunts.add(
        new Document()
            .append("accessCode", "123456")
            .append("completeHunt", new Document()
                .append("hunt", testHunts.get(0))
                .append("tasks", testTasks.subList(0, 2)))
            .append("status", true));

    startedHunts.add(
        new Document()
            .append("accessCode", "654321")
            .append("completeHunt", new Document()
                .append("hunt", testHunts.get(1))
                .append("tasks", testTasks.subList(2, 3)))
            .append("status", false));

    startedHunts.add(
        new Document()
            .append("accessCode", "123459")
            .append("completeHunt", new Document()
                .append("hunt", testHunts.get(2))
                .append("tasks", testTasks.subList(0, 3)))
            .append("status", true));

    startedHuntId = new ObjectId();
    Document startedHunt = new Document()
        .append("_id", startedHuntId)
        .append("accessCode", "123456")
        .append("completeHunt", new Document()
                .append("hunt", testHunts.get(2))
                .append("tasks", testTasks.subList(0, 3)))
            .append("status", true);

    startedHuntsDocuments.insertMany(startedHunts);
    startedHuntsDocuments.insertOne(startedHunt);

    hostController = new HostController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    hostController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

  @Test
  void getHostById() throws IOException {
    String id = frysId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    hostController.getHost(ctx);

    verify(ctx).json(hostCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("Fry", hostCaptor.getValue().name);
    assertEquals(frysId.toHexString(), hostCaptor.getValue()._id);
  }

  @Test
  void getHostWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getHost(ctx);
    });

    assertEquals("The requested host id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getHostWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      hostController.getHost(ctx);
    });

    assertEquals("The requested host was not found", exception.getMessage());
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

    Hunt hunt = hostController.getHunt(ctx);

    assertEquals("Best Hunt", hunt.name);
    assertEquals(huntId.toHexString(), hunt._id);
  }

  @Test
  void getHuntWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getHunt(ctx);
    });

    assertEquals("The requested hunt id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getHuntWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      hostController.getHunt(ctx);
    });

    assertEquals("The requested hunt was not found", exception.getMessage());
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
    String tooLong = "t".repeat(HostController.REASONABLE_DESCRIPTION_LENGTH_HUNT + 1);
    String testNewHunt = String.format("""
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "%s",
          "est": 45,
          "numberOfTasks": 3
        }
        """, tooLong);
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
  void addHuntWithMaxEST() throws IOException {
    String testNewHunt = """
        {
          "hostId": "frysId",
          "name": "New Hunt",
          "description": "Newly made hunt",
          "est": 240,
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
    assertEquals(240, addedHunt.get("est"));
    assertEquals(3, addedHunt.get("numberOfTasks"));
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
  void getTasksByHuntId() throws IOException {
    String id = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    ArrayList<Task> tasks = hostController.getTasks(ctx);

    assertEquals(3, tasks.size());
    for (Task task : tasks) {
      assertEquals(huntId.toHexString(), task.huntId);
    }
  }

  @Test
  void increaseTaskCount() throws IOException {
    String testHuntId = huntId.toHexString();
    assertEquals(3, db.getCollection("hunts").find(eq("_id", new ObjectId(testHuntId))).first().get("numberOfTasks"));

    hostController.increaseTaskCount(testHuntId);

    Document hunt = db.getCollection("hunts").find(eq("_id", new ObjectId(testHuntId))).first();
    assertEquals(4, hunt.get("numberOfTasks"));
  }

  @Test
  void decreaseTaskCount() throws IOException {
    String testHuntId = huntId.toHexString();
    assertEquals(3, db.getCollection("hunts").find(eq("_id", new ObjectId(testHuntId))).first().get("numberOfTasks"));

    hostController.decreaseTaskCount(testHuntId);

    Document hunt = db.getCollection("hunts").find(eq("_id", new ObjectId(testHuntId))).first();
    assertEquals(2, hunt.get("numberOfTasks"));
  }

  @Test
  void addTask() throws IOException {
    String testNewTask = """
        {
          "huntId": "bestHuntId",
          "name": "New Task",
          "status": false
        }
        """;
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    hostController.addNewTask(ctx);
    verify(ctx).json(mapCaptor.capture());

    verify(ctx).status(HttpStatus.CREATED);

    Document addedTask = db.getCollection("tasks")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    assertNotEquals("", addedTask.get("_id"));
    assertEquals("New Task", addedTask.get("name"));
    assertEquals("bestHuntId", addedTask.get("huntId"));
    assertEquals(false, addedTask.get("status"));
    assertEquals(new ArrayList<String>(), addedTask.get("photos"));
  }

  @Test
  void addInvalidHuntIdTask() throws IOException {
    String testNewTask = """
        {
          "huntId": "",
          "name": "New Task",
          "status": false
        }
        """;
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewTask(ctx);
    });
  }

  @Test
  void addInvalidHuntIdNullTask() throws IOException {
    String testNewTask = """
        {
          "huntId": null,
          "name": "New Task",
          "status": false
        }
        """;
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewTask(ctx);
    });
  }

  @Test
  void addInvalidNoNameTask() throws IOException {
    String testNewTask = """
        {
          "huntId": "bestHuntId",
          "name": "",
          "status": false
        }
        """;
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewTask(ctx);
    });
  }

  @Test
  void addInvalidLongNameTask() throws IOException {
    String tooLong = "t".repeat(HostController.REASONABLE_NAME_LENGTH_TASK + 1);
    String testNewTask = String.format("""
        {
          "huntId": "bestHuntId",
          "name": "%s",
          "status": false
        }
        """, tooLong);
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewTask(ctx);
    });
  }

  @Test
  void addInvalidStatusTask() throws IOException {
    String testNewTask = """
        {
          "huntId": "bestHuntId",
          "name": "",
          "status": null
        }
        """;
    when(ctx.bodyValidator(Task.class))
        .then(value -> new BodyValidator<Task>(testNewTask, Task.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      hostController.addNewTask(ctx);
    });
  }

  @Test
  void deleteFoundHunt() throws IOException {
    String testID = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(1, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    hostController.deleteHunt(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
    assertEquals(0, db.getCollection("tasks").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundHunt() throws IOException {
    String testID = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    hostController.deleteHunt(ctx);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      hostController.deleteHunt(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void deleteFoundTask() throws IOException {
    String testID = taskId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(1, db.getCollection("tasks").countDocuments(eq("_id", new ObjectId(testID))));

    hostController.deleteTask(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("tasks").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundTask() throws IOException {
    String testID = taskId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    hostController.deleteTask(ctx);
    assertEquals(0, db.getCollection("tasks").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      hostController.deleteTask(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);
    assertEquals(0, db.getCollection("tasks").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void getCompleteHuntById() throws IOException {
    String id = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    hostController.getCompleteHunt(ctx);

    verify(ctx).json(completeHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("Best Hunt", completeHuntCaptor.getValue().hunt.name);
    assertEquals(huntId.toHexString(), completeHuntCaptor.getValue().hunt._id);

    assertEquals(3, completeHuntCaptor.getValue().tasks.size());
    for (Task task : completeHuntCaptor.getValue().tasks) {
      assertEquals(huntId.toHexString(), task.huntId);
    }
  }

  @Test
  void getCompleteHuntWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getCompleteHunt(ctx);
    });

    assertEquals("The requested hunt id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void deleteTasksWithHunt() throws IOException {
    String testID = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(3, db.getCollection("tasks").countDocuments(eq("huntId", testID)));

    hostController.deleteTasks(ctx);

    assertEquals(0, db.getCollection("tasks").countDocuments(eq("huntId", testID)));
  }

  @Test
  void startHuntCreatesNewStartedHunt() throws IOException {
    String testID = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    Document hunt = db.getCollection("hunts").find(eq("_id", new ObjectId(testID))).first();
    assertNotNull(hunt);

    hostController.startHunt(ctx);

    verify(ctx).status(HttpStatus.CREATED);

    Document startedHunt = db.getCollection("startedHunts").find(eq("completeHunt.hunt._id", new ObjectId(testID)))
        .first();
    assertNotNull(startedHunt);
    assertEquals(hunt.get("_id"),
        startedHunt.get("completeHunt", Document.class).get("hunt", Document.class).get("_id"));
    assertTrue(startedHunt.getBoolean("status"));
    assertNotNull(startedHunt.getString("accessCode"));
  }

  @Test
  void startHuntThrowsExceptionWhenHuntNotFound() throws IOException {
    String testID = "507f1f77bcf86cd799439011";
    when(ctx.pathParam("id")).thenReturn(testID);

    Document hunt = db.getCollection("hunts").find(eq("_id", new ObjectId(testID))).first();
    assertNull(hunt);

    Exception exception = assertThrows(NotFoundResponse.class, () -> {
      hostController.startHunt(ctx);
    });

    assertEquals("The requested hunt was not found", exception.getMessage());

    Document startedHunt = db.getCollection("startedHunts").find(eq("hunt._id", new ObjectId(testID))).first();
    assertNull(startedHunt);
  }

  @Test
  void getStartedHunt() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("123456");

    hostController.getStartedHunt(ctx);

    verify(ctx).json(startedHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("123456", startedHuntCaptor.getValue().accessCode);
    assertEquals(true, startedHuntCaptor.getValue().status);
  }

  @Test
  void getStartedHuntWithNonExistentAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("588935");

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      hostController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code was not found.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithInvalidAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("12345"); // 5-digit number

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code is not a valid access code.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithNonNumericAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("123abc"); // Access code with non-numeric characters

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code is not a valid access code.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithStatusFalse() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("654321");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      hostController.getStartedHunt(ctx);
    });

    assertEquals("The requested hunt is no longer joinable.", exception.getMessage());
  }

  @Test
  void getEndedHunts() throws IOException {
    hostController.getEndedHunts(ctx);

    verify(ctx).json(startedHuntArrayListCaptor.capture());

    assertEquals(1, startedHuntArrayListCaptor.getValue().size());
    for (StartedHunt startedHunt : startedHuntArrayListCaptor.getValue()) {
      assertEquals(false, startedHunt.status);
    }
  }

  @Test
  void endStartedHunt() throws IOException {
    when(ctx.pathParam("id")).thenReturn(startedHuntId.toHexString());
    when(ctx.pathParam("accessCode")).thenReturn("123456");

    // Check the initial status
    hostController.getStartedHunt(ctx);
    verify(ctx).json(startedHuntCaptor.capture());
    assertEquals(true, startedHuntCaptor.getValue().status);

    // End the hunt
    hostController.endStartedHunt(ctx);
    verify(ctx, times(2)).status(HttpStatus.OK);

    // Check the status after ending the hunt
    hostController.getEndedHunts(ctx);
    verify(ctx).json(startedHuntArrayListCaptor.capture());
    for (StartedHunt startedHunt : startedHuntArrayListCaptor.getValue()) {
      if (startedHunt._id.equals("123456")) {
        assertEquals(false, startedHunt.status);
      }
    }
  }

  @Test
  void endStartedHuntIsNull() throws IOException {
    when(ctx.pathParam("id")).thenReturn("588935f57546a2daea54de8c");

    assertThrows(NotFoundResponse.class, () -> {
      hostController.endStartedHunt(ctx);
    });
  }

  @Test
  void deleteFoundStartedHunt() throws IOException {
    String testID = startedHuntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    assertEquals(1, db.getCollection("startedHunts").countDocuments(eq("_id", new ObjectId(testID))));

    hostController.deleteStartedHunt(ctx);

    verify(ctx).status(HttpStatus.OK);

    assertEquals(0, db.getCollection("startedHunts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundStartedHunt() throws IOException {
    String testID = startedHuntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    hostController.deleteStartedHunt(ctx);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      hostController.deleteStartedHunt(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void testGetFileExtensionWithExtension() {
    String filename = "test.txt";

    String extension = hostController.getFileExtension(filename);

    assertEquals("txt", extension);
  }

  @Test
  void testGetFileExtensionWithoutExtension() {
    String filename = "test";

    String extension = hostController.getFileExtension(filename);

    assertEquals("", extension);
  }

  @Test
  void testUploadPhotoWithPhoto() throws IOException {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);

    String id = hostController.uploadPhoto(ctx);

    verify(ctx).status(HttpStatus.OK);
    hostController.deletePhoto(id, ctx);
  }

  @Test
  void testUploadPhotoWithoutPhoto() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      hostController.uploadPhoto(ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Unexpected error during photo upload: No photo uploaded", e.getMessage());
    }
  }

  @Test
  void testUploadPhotoWithException() throws IOException {

    UploadedFile uploadedFile = mock(UploadedFile.class);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenThrow(new RuntimeException("Test Exception"));
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      hostController.uploadPhoto(ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Unexpected error during photo upload: Test Exception", e.getMessage());
    }
  }

  @Test
  void testDeletePhotoWithoutPhoto() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      hostController.deletePhoto("test", ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Photo with ID test does not exist", e.getMessage());
    }
  }

  @Test
  void testDeletePhotoBadRequestResponse() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      hostController.deletePhoto("test", ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Photo with ID test does not exist", e.getMessage());
    }
  }

  @Test
  void testAddPhotoPathToTask() throws IOException {
    String photoPath = "test.jpg";

    when(ctx.pathParam("id")).thenReturn(taskId.toHexString());

    hostController.addPhotoPathToTask(ctx, photoPath);

    Document updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    assertNotNull(updatedTask);
    assertEquals(1, updatedTask.get("photos", List.class).size());
  }

  @Test
  void testAddPhotoPathToTaskErrorHandling() {
    String id = "588935f56536a3daea54de8c";
    String photoPath = "photoPath";

    when(ctx.pathParam("id")).thenReturn(id);

    assertThrows(BadRequestResponse.class, () -> hostController.addPhotoPathToTask(ctx, photoPath));
    verify(ctx).status(HttpStatus.NOT_FOUND);
  }

  @Test
  void testAddPhoto() {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("id")).thenReturn(taskId.toHexString());

    hostController.addPhoto(ctx);

    Document updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    String id = updatedTask.get("photos", List.class).get(0).toString();

    verify(ctx).status(HttpStatus.OK);
    hostController.deletePhoto(id, ctx);
  }

  @Test
  void testGetPhotosFromTask() throws IOException {
    // Create a Task with the paths of the temporary files
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("id")).thenReturn(taskId.toHexString());

    hostController.addPhoto(ctx);

    Document updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    Task task = new Task();
    task.photos = updatedTask.get("photos", List.class);
    task.huntId = updatedTask.getString("huntId");
    task.name = updatedTask.getString("name");
    task.status = updatedTask.getBoolean("status");
    task._id = updatedTask.getObjectId("_id").toHexString();

    File addedFile = new File("photos/" + task.photos.get(0));

    // Call the method under test
    List<String> encodedPhotos = hostController.getPhotosFromTask(task);

    // Check that the returned list has the correct size
    assertEquals(1, encodedPhotos.size());

    // Check that the returned list contains the correct encoded photos
    byte[] bytes1 = Files.readAllBytes(addedFile.toPath());
    String expectedEncoded1 = Base64.getEncoder().encodeToString(bytes1);
    assertEquals(expectedEncoded1, encodedPhotos.get(0));

    hostController.deletePhoto(task.photos.get(0), ctx);
  }

  @Test
  void testRemovePhotoPathFromTask() {
    String photoPath = "test.jpg";
    when(ctx.pathParam("id")).thenReturn(taskId.toHexString());

    hostController.addPhotoPathToTask(ctx, photoPath);
    hostController.removePhotoPathFromTask(ctx, taskId.toHexString(), photoPath);

    Document updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    assertNotNull(updatedTask);
    assertEquals(0, updatedTask.get("photos", List.class).size());
  }

  @Test
  void testRemovePhotoPathFromTaskErrorHandling() {
    String id = "588935f56536a3daea54de8c";
    String photoPath = "photoPath";

    when(ctx.pathParam("id")).thenReturn(id);

    assertThrows(BadRequestResponse.class, () -> hostController.removePhotoPathFromTask(ctx, id, photoPath));
    verify(ctx).status(HttpStatus.NOT_FOUND);
  }

  @Test
  void testReplacePhoto() {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test1.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("id")).thenReturn(taskId.toHexString());

    hostController.addPhoto(ctx);
    Document updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    String photoId = updatedTask.get("photos", List.class).get(0).toString();
    when(ctx.pathParam("photoId")).thenReturn(photoId);
    hostController.replacePhoto(ctx);

    updatedTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    assertFalse(updatedTask.get("photos", List.class).get(0).toString().equals(photoId));
    photoId = updatedTask.get("photos", List.class).get(0).toString();

    assertNotNull(updatedTask);
    hostController.deletePhoto(photoId, ctx);
  }

  @Test
  void testGetStartedHuntByIdValidId() {
    when(ctx.pathParam("finishedHuntId")).thenReturn(startedHuntId.toHexString());

    StartedHunt startedHunt = hostController.getStartedHuntById(ctx);

    assertEquals("123456", startedHunt.accessCode);
    assertEquals(true, startedHunt.status);
  }

  @Test
  void testGetStartedHuntByIdInvalidId() {
    String id = "invalid_id";

    when(ctx.pathParam("finishedHuntId")).thenReturn(id);

    assertThrows(BadRequestResponse.class, () -> hostController.getStartedHuntById(ctx));
  }

  @Test
  void testGetStartedHuntByIdNotFound() {
    String id = new ObjectId().toHexString();

    when(ctx.pathParam("finishedHuntId")).thenReturn(id);

    assertThrows(NotFoundResponse.class, () -> hostController.getStartedHuntById(ctx));
  }

  @Test
  void testGetFinishedTasks() {
    String id = huntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    ArrayList<FinishedTask> tasks = hostController.getFinishedTasks(ctx);

    assertEquals(3, tasks.size());
  }

  @Test
  void testGetFinishedHunt() {
    ArrayList<FinishedTask> finishedTasks = new ArrayList<>();

    when(ctx.pathParam("finishedHuntId")).thenReturn(startedHuntId.toHexString());

    hostController.getFinishedHunt(ctx);

    verify(ctx).status(HttpStatus.OK);
    verify(ctx).json(finishedHuntCaptor.capture());

    FinishedHunt finishedHunt = finishedHuntCaptor.getValue();
    assertNotNull(finishedHunt.startedHunt);
    assertEquals(finishedTasks, finishedHunt.finishedTasks);
  }

}
