package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "landowners")
@Getter
@Setter
public class Landowner {

    @Id
    private String landowner;

}

