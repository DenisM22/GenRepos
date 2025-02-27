package backend.repositories;

import backend.models.references.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findAllByVolost_IdAndPlaceStartingWithIgnoreCase(Long volostId, String place);

}
