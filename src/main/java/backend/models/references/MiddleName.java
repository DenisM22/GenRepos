package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "middle_names")
@Getter
@Setter
@NoArgsConstructor
public class MiddleName {

    public MiddleName(String middleName) {
        this.middleName = middleName;
    }

    @Id
    private String middleName;

}

