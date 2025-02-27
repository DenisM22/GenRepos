package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "volosts")
@Getter
@Setter
public class Volost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "volost", unique = true, nullable = false)
    private String volost;

    @ManyToOne
    @JoinColumn(name = "uyezd_id")
    private Uyezd uyezd;

}
