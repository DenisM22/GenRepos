package backend.dto;

import backend.models.references.Parish;
import backend.models.references.Place;
import lombok.Data;

@Data
public class DocumentLightDto {

    private Long id;
    private String title;
    private Short createdAt;
    private Parish parish;
    private Place place;

}
