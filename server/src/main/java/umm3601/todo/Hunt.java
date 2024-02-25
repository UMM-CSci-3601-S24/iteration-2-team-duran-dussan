package umm3601.todo;

import java.util.List;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Hunt {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;
    public String todoId;

    public String name;
    public String description;
    public int est;
    public List<ObjectId> tasks;
}
