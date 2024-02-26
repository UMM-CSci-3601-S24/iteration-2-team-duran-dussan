package umm3601.host;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Host {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String name;
    public String userName;
    public String email;

}
