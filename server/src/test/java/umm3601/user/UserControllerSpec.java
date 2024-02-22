package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
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
import org.mockito.ArgumentMatcher;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
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
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;

/**
 * Tests the logic of the UserController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber" })
class UserControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private UserController userController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId samsId;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<User>> userArrayListCaptor;

  @Captor
  private ArgumentCaptor<User> userCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method. It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   */
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
    // Reset our mock context and argument captor (declared with Mockito
    // annotations @Mock and @Captor)
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(
        new Document()
            .append("name", "Chris")
            .append("age", 25)
            .append("company", "UMM")
            .append("email", "chris@this.that")
            .append("role", "admin")
            .append("avatar", "https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon"));
    testUsers.add(
        new Document()
            .append("name", "Pat")
            .append("age", 37)
            .append("company", "IBM")
            .append("email", "pat@something.com")
            .append("role", "editor")
            .append("avatar", "https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon"));
    testUsers.add(
        new Document()
            .append("name", "Jamie")
            .append("age", 37)
            .append("company", "OHMNET")
            .append("email", "jamie@frogs.com")
            .append("role", "viewer")
            .append("avatar", "https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon"));

    samsId = new ObjectId();
    Document sam = new Document()
        .append("_id", samsId)
        .append("name", "Sam")
        .append("age", 45)
        .append("company", "OHMNET")
        .append("email", "sam@frogs.com")
        .append("role", "viewer")
        .append("avatar", "https://gravatar.com/avatar/08b7610b558a4cbbd20ae99072801f4d?d=identicon");

    userDocuments.insertMany(testUsers);
    userDocuments.insertOne(sam);

    userController = new UserController(db);
  }

  @Test
  void addsRoutes() {
    Javalin mockServer = mock(Javalin.class);
    userController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(3)).get(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).delete(any(), any());
  }

  @Test
  void canGetAllUsers() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in
    // this case where we want all users).
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    // Now, go ahead and ask the userController to getUsers
    // (which will, indeed, ask the context for its queryParamMap)
    userController.getUsers(ctx);

    // We are going to capture an argument to a function, and the type of
    // that argument will be of type ArrayList<User> (we said so earlier
    // using a Mockito annotation like this):
    // @Captor
    // private ArgumentCaptor<ArrayList<User>> userArrayListCaptor;
    // We only want to declare that captor once and let the annotation
    // help us accomplish reassignment of the value for the captor
    // We reset the values of our annotated declarations using the command
    // `MockitoAnnotations.openMocks(this);` in our @BeforeEach

    // Specifically, we want to pay attention to the ArrayList<User> that
    // is passed as input when ctx.json is called --- what is the argument
    // that was passed? We capture it and can refer to it later.
    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents
    // as the size of the captured List<User>
    assertEquals(
        db.getCollection("users").countDocuments(),
        userArrayListCaptor.getValue().size());
  }

  @Test
  void canGetUsersWithAge37() throws IOException {
    // Add a query param map to the context that maps "age" to "37".
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.AGE_KEY, Arrays.asList(new String[] {"37"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class))
        .thenReturn(Validator.create(Integer.class, "37", UserController.AGE_KEY));

    userController.getUsers(ctx);

    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(2, userArrayListCaptor.getValue().size());
    for (User user : userArrayListCaptor.getValue()) {
      assertEquals(37, user.age);
    }
  }

  // We've included another approach for testing if everything behaves when we ask
  // for users that are 37
  @Test
  void canGetUsersWithAge37Redux() throws JsonMappingException, JsonProcessingException {
    // When the controller calls `ctx.queryParamMap`, return the expected map for an
    // "?age=37" query.
    when(ctx.queryParamMap()).thenReturn(Map.of(UserController.AGE_KEY, List.of("37")));
    // When the controller calls `ctx.queryParamAsClass() to get the value
    // associated with the "age" key, return an appropriate Validator.
    Validator<Integer> validator = Validator.create(Integer.class, "37", UserController.AGE_KEY);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class)).thenReturn(validator);

    // Call the method under test.
    userController.getUsers(ctx);

    // Verify that `getUsers` included a call to `ctx.status(HttpStatus.OK)` at some
    // point.
    verify(ctx).status(HttpStatus.OK);

    // Instead of using the Captor like in many other tests, we will use an
    // ArgumentMatcher just to show that it can be done and illustrate
    // another way to test the same thing.
    // Verify that `ctx.json()` is called with a `List` of `User`s.
    // Each of those `User`s should have age 37.
    verify(ctx).json(argThat(new ArgumentMatcher<List<User>>() {
      @Override
      public boolean matches(List<User> users) {
        for (User user : users) {
          assertEquals(37, user.age);
        }
        return true;
      }
    }));
  }

  /**
   * Test that if the user sends a request with an illegal value in
   * the age field (i.e., something that can't be parsed to a number)
   * we get a reasonable error code back.
   */
  @Test
  void respondsAppropriatelyToNonNumericAge() {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.AGE_KEY, Arrays.asList(new String[] {"bad"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class))
        .thenReturn(Validator.create(Integer.class, "bad", UserController.AGE_KEY));

    // This should now throw a `ValidationException` because
    // our request has an age that can't be parsed to a number,
    // but I don't yet know how to make the message be anything specific
    assertThrows(ValidationException.class, () -> {
      userController.getUsers(ctx);
    });
  }

  /**
   * Test that if the user sends a request with an illegal value in
   * the age field (i.e., too big of a number)
   * we get a reasonable error code back.
   */
  @Test
  void respondsAppropriatelyToTooLargeNumberAge() {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.AGE_KEY, Arrays.asList(new String[] {"151"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class))
        .thenReturn(Validator.create(Integer.class, "151", UserController.AGE_KEY));

    // This should now throw a `ValidationException` because
    // our request has an age that is larger than 150, which isn't allowed,
    // but I don't yet know how to make the message be anything specific
    assertThrows(ValidationException.class, () -> {
      userController.getUsers(ctx);
    });
  }

  /**
   * Test that if the user sends a request with an illegal value in
   * the age field (i.e., too small of a number)
   * we get a reasonable error code back.
   */
  @Test
  void respondsAppropriatelyToTooSmallNumberAge() {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.AGE_KEY, Arrays.asList(new String[] {"-1"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class))
        .thenReturn(Validator.create(Integer.class, "-1", UserController.AGE_KEY));

    // This should now throw a `ValidationException` because
    // our request has an age that is smaller than 0, which isn't allowed,
    // but I don't yet know how to make the message be anything specific
    assertThrows(ValidationException.class, () -> {
      userController.getUsers(ctx);
    });
  }

  @Test
  void canGetUsersWithCompany() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.COMPANY_KEY, Arrays.asList(new String[] {"OHMNET"}));
    queryParams.put(UserController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(UserController.COMPANY_KEY)).thenReturn("OHMNET");
    when(ctx.queryParam(UserController.SORT_ORDER_KEY)).thenReturn("desc");

    userController.getUsers(ctx);

    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (User user : userArrayListCaptor.getValue()) {
      assertEquals("OHMNET", user.company);
    }
  }

  @Test
  void canGetUsersWithCompanyLowercase() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.COMPANY_KEY, Arrays.asList(new String[] {"ohm"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(UserController.COMPANY_KEY)).thenReturn("ohm");

    userController.getUsers(ctx);

    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the users passed to `json` work for OHMNET.
    for (User user : userArrayListCaptor.getValue()) {
      assertEquals("OHMNET", user.company);
    }
  }

  @Test
  void getUsersByRole() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.ROLE_KEY, Arrays.asList(new String[] {"viewer"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(UserController.ROLE_KEY, String.class))
        .thenReturn(Validator.create(String.class, "viewer", UserController.ROLE_KEY));

    userController.getUsers(ctx);

    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(2, userArrayListCaptor.getValue().size());
  }

  @Test
  void getUsersByCompanyAndAge() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(UserController.COMPANY_KEY, Arrays.asList(new String[] {"OHMNET"}));
    queryParams.put(UserController.AGE_KEY, Arrays.asList(new String[] {"37"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParam(UserController.COMPANY_KEY)).thenReturn("OHMNET");
    when(ctx.queryParamAsClass(UserController.AGE_KEY, Integer.class))
        .thenReturn(Validator.create(Integer.class, "37", UserController.AGE_KEY));

    userController.getUsers(ctx);

    verify(ctx).json(userArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(1, userArrayListCaptor.getValue().size());
    for (User user : userArrayListCaptor.getValue()) {
      assertEquals("OHMNET", user.company);
      assertEquals(37, user.age);
    }
  }

  @Test
  void getUserWithExistentId() throws IOException {
    String id = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    userController.getUser(ctx);

    verify(ctx).json(userCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("Sam", userCaptor.getValue().name);
    assertEquals(samsId.toHexString(), userCaptor.getValue()._id);
  }

  @Test
  void getUserWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      userController.getUser(ctx);
    });

    assertEquals("The requested user id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getUserWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });

    assertEquals("The requested user was not found", exception.getMessage());
  }

  @Captor
  private ArgumentCaptor<ArrayList<UserByCompany>> userByCompanyListCaptor;

  @Test
  void testGetUsersGroupedByCompany() {
    when(ctx.queryParam("sortBy")).thenReturn("company");
    when(ctx.queryParam("sortOrder")).thenReturn("asc");
    userController.getUsersGroupedByCompany(ctx);

    // Capture the argument to `ctx.json()`
    verify(ctx).json(userByCompanyListCaptor.capture());

    // Get the value that was passed to `ctx.json()`
    ArrayList<UserByCompany> result = userByCompanyListCaptor.getValue();

    // There are 3 companies in the test data, so we should have 3 entries in the
    // result.
    assertEquals(3, result.size());

    // The companies should be in alphabetical order by company name,
    // and with user counts of 1, 2, and 1, respectively.
    UserByCompany ibm = result.get(0);
    assertEquals("IBM", ibm._id);
    assertEquals(1, ibm.count);
    UserByCompany ohmnet = result.get(1);
    assertEquals("OHMNET", ohmnet._id);
    assertEquals(2, ohmnet.count);
    UserByCompany umm = result.get(2);
    assertEquals("UMM", umm._id);
    assertEquals(1, umm.count);

    // The users for OHMNET should be Jamie and Sam, although we don't
    // know what order they'll be in.
    assertEquals(2, ohmnet.users.size());
    assertTrue(ohmnet.users.get(0).name.equals("Jamie") || ohmnet.users.get(0).name.equals("Sam"),
        "First user should have name 'Jamie' or 'Sam'");
    assertTrue(ohmnet.users.get(1).name.equals("Jamie") || ohmnet.users.get(1).name.equals("Sam"),
        "Second user should have name 'Jamie' or 'Sam'");
  }

  @Test
  void testGetUsersGroupedByCompanyDescending() {
    when(ctx.queryParam("sortBy")).thenReturn("company");
    when(ctx.queryParam("sortOrder")).thenReturn("desc");
    userController.getUsersGroupedByCompany(ctx);

    // Capture the argument to `ctx.json()`
    verify(ctx).json(userByCompanyListCaptor.capture());

    // Get the value that was passed to `ctx.json()`
    ArrayList<UserByCompany> result = userByCompanyListCaptor.getValue();

    // There are 3 companies in the test data, so we should have 3 entries in the
    // result.
    assertEquals(3, result.size());

    // The companies should be in reverse alphabetical order by company name,
    // and with user counts of 1, 2, and 1, respectively.
    UserByCompany umm = result.get(0);
    assertEquals("UMM", umm._id);
    assertEquals(1, umm.count);
    UserByCompany ohmnet = result.get(1);
    assertEquals("OHMNET", ohmnet._id);
    assertEquals(2, ohmnet.count);
    UserByCompany ibm = result.get(2);
    assertEquals("IBM", ibm._id);
    assertEquals(1, ibm.count);
  }

  @Test
  void testGetUsersGroupedByCompanyOrderedByCount() {
    when(ctx.queryParam("sortBy")).thenReturn("count");
    when(ctx.queryParam("sortOrder")).thenReturn("asc");
    userController.getUsersGroupedByCompany(ctx);

    // Capture the argument to `ctx.json()`
    verify(ctx).json(userByCompanyListCaptor.capture());

    // Get the value that was passed to `ctx.json()`
    ArrayList<UserByCompany> result = userByCompanyListCaptor.getValue();

    // There are 3 companies in the test data, so we should have 3 entries in the
    // result.
    assertEquals(3, result.size());

    // The companies should be in order by user count, and with counts of 1, 1, and
    // 2,
    // respectively. We don't know which order "IBM" and "UMM" will be in, since
    // they
    // both have a count of 1. So we'll get them both and then swap them if
    // necessary.
    UserByCompany ibm = result.get(0);
    UserByCompany umm = result.get(1);
    if (ibm._id.equals("UMM")) {
      umm = result.get(0);
      ibm = result.get(1);
    }
    UserByCompany ohmnet = result.get(2);
    assertEquals("IBM", ibm._id);
    assertEquals(1, ibm.count);
    assertEquals("UMM", umm._id);
    assertEquals(1, umm.count);
    assertEquals("OHMNET", ohmnet._id);
    assertEquals(2, ohmnet.count);
  }

  @Test
  void addUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 25,
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    userController.addNewUser(ctx);
    verify(ctx).json(mapCaptor.capture());

    // Our status should be 201, i.e., our new user was successfully created.
    verify(ctx).status(HttpStatus.CREATED);

    // Verify that the user was added to the database with the correct ID
    Document addedUser = db.getCollection("users")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    // Successfully adding the user should return the newly generated, non-empty
    // MongoDB ID for that user.
    assertNotEquals("", addedUser.get("_id"));
    assertEquals("Test User", addedUser.get("name"));
    assertEquals(25, addedUser.get(UserController.AGE_KEY));
    assertEquals("testers", addedUser.get(UserController.COMPANY_KEY));
    assertEquals("test@example.com", addedUser.get("email"));
    assertEquals("viewer", addedUser.get(UserController.ROLE_KEY));
    assertNotNull(addedUser.get("avatar"));
  }

  @Test
  void addInvalidEmailUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 25,
          "company": "testers",
          "email": "invalidemail",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });

    // Our status should be 400, because our request contained information that
    // didn't validate.
    // However, I'm not yet sure how to test the specifics about validation problems
    // encountered.
    // verify(ctx).status(HttpStatus.BAD_REQUEST);
  }

  @Test
  void addInvalidAgeUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": "notanumber",
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void add0AgeUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 0,
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void add150AgeUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 150,
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void addNullNameUser() throws IOException {
    String testNewUser = """
        {
          "age": 25,
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void addInvalidNameUser() throws IOException {
    String testNewUser = """
        {
          "name": "",
          "age": 25,
          "company": "testers",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void addInvalidRoleUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 25,
          "company": "testers",
          "email": "test@example.com",
          "role": "invalidrole"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void addNullCompanyUser() throws IOException {
    String testNewUser = """
        {
          "name": "Test User",
          "age": 25,
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void addInvalidCompanyUser() throws IOException {
    String testNewUser = """
        {
          "name": "",
          "age": 25,
          "company": "",
          "email": "test@example.com",
          "role": "viewer"
        }
        """;
    when(ctx.bodyValidator(User.class))
        .then(value -> new BodyValidator<User>(testNewUser, User.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      userController.addNewUser(ctx);
    });
  }

  @Test
  void deleteFoundUser() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    // User exists before deletion
    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));

    userController.deleteUser(ctx);

    verify(ctx).status(HttpStatus.OK);

    // User is no longer in the database
    assertEquals(0, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundUser() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    userController.deleteUser(ctx);
    // User is no longer in the database
    assertEquals(0, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      userController.deleteUser(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    // User is still not in the database
    assertEquals(0, db.getCollection("users").countDocuments(eq("_id", new ObjectId(testID))));
  }

  /**
   * Test that the `generateAvatar` method works as expected.
   *
   * To test this code, we need to mock out the `md5()` method so we
   * can control what it returns. This way we don't have to figure
   * out what the actual md5 hash of a particular email address is.
   *
   * The use of `Mockito.spy()` essentially allows us to override
   * the `md5()` method, while leaving the rest of the user controller
   * "as is". This is a nice way to test a method that depends on
   * an internal method that we don't want to test (`md5()` in this case).
   *
   * This code was suggested by GitHub CoPilot.
   *
   * @throws NoSuchAlgorithmException
   */
  @Test
  void testGenerateAvatar() throws NoSuchAlgorithmException {
    // Arrange
    String email = "test@example.com";
    UserController controller = Mockito.spy(userController);
    when(controller.md5(email)).thenReturn("md5hash");

    // Act
    String avatar = controller.generateAvatar(email);

    // Assert
    assertEquals("https://gravatar.com/avatar/md5hash?d=identicon", avatar);
  }

  /**
   * Test that the `generateAvatar` throws a `NoSuchAlgorithmException`
   * if it can't find the `md5` hashing algortihm.
   *
   * To test this code, we need to mock out the `md5()` method so we
   * can control what it returns. In particular, we want `.md5()` to
   * throw a `NoSuchAlgorithmException`, which we can't do without
   * mocking `.md5()` (since the algorithm does actually exist).
   *
   * The use of `Mockito.spy()` essentially allows us to override
   * the `md5()` method, while leaving the rest of the user controller
   * "as is". This is a nice way to test a method that depends on
   * an internal method that we don't want to test (`md5()` in this case).
   *
   * This code was suggested by GitHub CoPilot.
   *
   * @throws NoSuchAlgorithmException
   */
  @Test
  void testGenerateAvatarWithException() throws NoSuchAlgorithmException {
    // Arrange
    String email = "test@example.com";
    UserController controller = Mockito.spy(userController);
    when(controller.md5(email)).thenThrow(NoSuchAlgorithmException.class);

    // Act
    String avatar = controller.generateAvatar(email);

    // Assert
    assertEquals("https://gravatar.com/avatar/?d=mp", avatar);
  }
}
