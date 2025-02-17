package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_statuses")
@Getter
@Setter
public class SocialStatus {

    @Id
    private String socialStatus;

}

