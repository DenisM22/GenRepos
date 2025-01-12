package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "fuzzy_dates")
@Getter
@Setter
public class FuzzyDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exact_date")
    private Date exactDate;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "description")
    private String description;

}
