package umm3601.host;


import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class StartedHunt {

  @ObjectId @Id
  @SuppressWarnings({"MemberName"})
    public String _id;
    public String accessCode;
    public Hunt hunt;
    public Boolean status;
}
