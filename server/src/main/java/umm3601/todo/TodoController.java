package umm3601.todo;

import io.javalin.Javalin;
import umm3601.Controller;

// import org.bson.UuidRepresentation;
// import org.mongojack.JacksonMongoCollection;

// import com.mongodb.client.MongoDatabase;

public class TodoController implements Controller {

  // private static final String API_TODOS = "/api/todos";
  // private static final String API_TODO_BY_ID = "/api/todos/{id}";
  // private final String Todo_Key = "todoId";

  // private final JacksonMongoCollection<Todo> todoCollection;

  // public TodoController(MongoDatabase database) {
  //   todoCollection = JacksonMongoCollection.builder().build(
  //     database,
  //     "todos",
  //     Todo.class,
  //      UuidRepresentation.STANDARD);
  // }

  @Override
  public void addRoutes(Javalin server) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'addRoutes'");
  }

}
