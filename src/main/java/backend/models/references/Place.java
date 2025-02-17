package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "places")
@Getter
@Setter
public class Place {

    @Id
    private String place;

}

