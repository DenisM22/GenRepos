package backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PersonFamilyTreeDto extends PersonLightDto {

    private PersonFamilyTreeParentDto father;
    private PersonFamilyTreeParentDto mother;
    private PersonLightDto spouse;
    private List<PersonFamilyTreeChildDto> children;

}
