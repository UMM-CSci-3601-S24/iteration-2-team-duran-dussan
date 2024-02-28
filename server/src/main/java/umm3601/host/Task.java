package umm3601.host;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Task {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String huntId;

    public String name;
    public boolean status;
}
