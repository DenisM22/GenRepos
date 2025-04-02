package backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PersonFamilyTreeChildDto extends PersonLightDto {

    private List<PersonFamilyTreeChildDto> children;

}
