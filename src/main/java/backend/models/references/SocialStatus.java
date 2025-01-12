package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_statuses")
@Getter
@Setter
public class SocialStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "social_status", nullable = false, unique = true)
    private String socialStatus;

}

