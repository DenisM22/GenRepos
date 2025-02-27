package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "uyezdy")
@Getter
@Setter
public class Uyezd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uyezd", unique = true, nullable = false)
    private String uyezd;

}

