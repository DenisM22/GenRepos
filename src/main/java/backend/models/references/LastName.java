package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "last_names")
@Getter
@Setter
@NoArgsConstructor
public class LastName {

    public LastName(String lastName) {
        this.lastName = lastName;
    }

    @Id
    private String lastName;

}

