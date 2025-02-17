package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parishes")
@Getter
@Setter
public class Parish {

    @Id
    private String parish;

}

