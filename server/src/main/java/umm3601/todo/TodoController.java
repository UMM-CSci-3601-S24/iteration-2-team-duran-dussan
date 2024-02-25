package umm3601.todo;

import io.javalin.Javalin;
import io.javalin.http.Context;
import umm3601.Controller;

import java.util.ArrayList;

import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;

public class TodoController implements Controller {

  private static final String API_TODOS = "/api/todos";
  private static final String API_TODO_BY_ID = "/api/todos/{id}";
  private final String Todo_Key = "todoId";
  private static final String API_HUNTS = "/api/hunts";

  private final JacksonMongoCollection<Todo> todoCollection;

  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(
      database,
      "todos",
      Todo.class,
       UuidRepresentation.STANDARD);
  }

  public void getHunts(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    ArrayList<Todo> matchingTodos = todoCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());
  }

  private Bson constructSortingOrder(Context ctx) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'constructSortingOrder'");
  }

  private Bson constructFilter(Context ctx) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'constructFilter'");
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_HUNTS, this::getHunts);
  }

}
