package backend.models.metricDocuments;

import backend.models.references.Parish;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "metric_documents")
@Getter
@Setter
public class MetricDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "created_at")
    private Short createdAt;

    @ManyToOne
    @JoinColumn(name = "parish_id")
    private Parish parish;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BirthRecord> birthRecords;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeathRecord> deathRecords;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MarriageRecord> marriageRecords;

}
