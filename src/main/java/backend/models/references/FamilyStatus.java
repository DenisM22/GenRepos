package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "family_statuses")
@Getter
@Setter
public class FamilyStatus {

    @Id
    private String familyStatus;

}

