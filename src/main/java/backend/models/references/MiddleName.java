package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "middle_names")
@Getter
@Setter
public class MiddleName {

    @Id
    private String middleName;

}

