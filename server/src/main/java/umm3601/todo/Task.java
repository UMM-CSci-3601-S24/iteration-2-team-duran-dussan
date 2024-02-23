package umm3601.todo;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Task {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String name;
    public boolean status;
}
