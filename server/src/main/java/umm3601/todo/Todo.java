package umm3601.todo;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Todo {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String name;
    public String userName;
    public String email;

}
