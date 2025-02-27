package backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class DocumentDto {

    private Long id;
    private String title;
    private Short yearOfCreation;
    private String parish;
    private String place;
    private String household;
    private byte[] image;
    private List<PersonLightDto> people;

}
