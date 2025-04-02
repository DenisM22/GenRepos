package backend.services;

import backend.dto.PersonFamilyTreeChildDto;
import backend.dto.PersonFamilyTreeDto;
import backend.dto.PersonFamilyTreeParentDto;
import backend.dto.PersonLightDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class GedcomService {

    private final PersonService personService;

    public String getGedcomFile(Long id) {
        PersonFamilyTreeDto person = personService.getFamilyTree(id);
        StringBuilder builder = new StringBuilder();

        IdWrapper fam = new IdWrapper();
        IdWrapper famInit = new IdWrapper();
        IdWrapper i = new IdWrapper();

        builder.append("0 HEAD")
                .append("\n1 SOUR Генеалогическое древо ").append(person.getLastName()).append(" ").append(person.getFirstName())
                .append("\n1 GEDC")
                .append("\n2 VERS 5.5")
                .append("\n1 CHAR UTF-8");

        builder.append(getGedcomPerson(person, i.value++));
        builder.append("\n1 FAMS @F").append(fam.value).append("@");

        if (person.getSpouse() != null) {
            builder.append(getGedcomPerson(person.getSpouse(), i.value++));
            builder.append("\n1 FAMS @F").append(fam.value).append("@");
        }

        if (person.getChildren() != null && !person.getChildren().isEmpty()) {
            for (PersonFamilyTreeChildDto child : person.getChildren()) {
                builder.append(getGedcomChild(child, famInit, i, fam));
            }
        }

        if (person.getFather() != null || person.getMother() != null) {
            fam.value++;
            famInit.value = fam.value;
            if (person.getFather() != null) {
                builder.append(getGedcomParents(person.getFather(), famInit, i, fam));
            }
            if (person.getMother() != null) {
                builder.append(getGedcomParents(person.getMother(), famInit, i, fam));
            }
        }

        builder.append("\n\n0 TRLR");

        return builder.toString();
    }

    private StringBuilder getGedcomChild(PersonFamilyTreeChildDto person, IdWrapper famInit, IdWrapper i, IdWrapper fam) {
        StringBuilder builder = new StringBuilder();

        builder.append(getGedcomPerson(person, i.value++));
        builder.append("\n1 FAMC @F").append(famInit.value).append("@");

        if (person.getChildren() != null && !person.getChildren().isEmpty()) {
            builder.append("\n1 FAMS @F").append(++fam.value).append("@");
            famInit = new IdWrapper(fam.value);
            for (PersonFamilyTreeChildDto child : person.getChildren()) {
                builder.append(getGedcomChild(child, famInit, i, fam));
            }
        }

        return builder;
    }

    private StringBuilder getGedcomParents(PersonFamilyTreeParentDto person, IdWrapper famInit, IdWrapper i, IdWrapper fam) {
        StringBuilder builder = new StringBuilder();

        builder.append(getGedcomPerson(person, i.value++));
        builder.append("\n1 FAMS @F").append(famInit.value).append("@");

        if (person.getFather() != null || person.getMother() != null) {
            fam.value++;
            famInit = new IdWrapper(fam.value);
            builder.append("\n1 FAMC @F").append(fam.value).append("@");
            if (person.getFather() != null) {
                builder.append(getGedcomParents(person.getFather(), famInit, i, fam));
            }
            if (person.getMother() != null) {
                builder.append(getGedcomParents(person.getMother(), famInit, i, fam));
            }
        }

        return builder;
    }

    private StringBuilder getGedcomPerson(PersonLightDto person, int i) {
        StringBuilder builder = new StringBuilder();

        builder.append("\n\n0 @I").append(i).append("@ INDI")
                .append("\n1 NAME ").append(person.getFirstName())
                .append(" ").append(person.getMiddleName())
                .append(" /").append(person.getLastName()).append("/");

        builder.append("\n1 SEX ").append(person.getGender().toString().toCharArray()[0]);

        if (person.getBirthDate() != null) {
            if (person.getBirthDate().getStartDate() == null && person.getBirthDate().getExactDate() != null)
                builder.append("\n1 BIRT")
                        .append("\n2 DATE ")
                        .append(person.getBirthDate().getDescription())
                        .append(": ")
                        .append(person.getBirthDate().getExactDate());
            else
                builder.append("\n1 BIRT")
                        .append("\n2 DATE Между: ").append(person.getBirthDate().getStartDate())
                        .append(" и ")
                        .append(person.getBirthDate().getExactDate());
        }

        if (person.getDeathDate() != null) {
            if (person.getDeathDate().getStartDate() == null && person.getDeathDate().getExactDate() != null)
                builder.append("\n1 BIRT")
                        .append("\n2 DATE ")
                        .append(person.getDeathDate().getDescription())
                        .append(": ")
                        .append(person.getDeathDate().getExactDate());
            else
                builder.append("\n1 BIRT")
                        .append("\n2 DATE Между: ").append(person.getDeathDate().getStartDate())
                        .append(" и ")
                        .append(person.getDeathDate().getEndDate());
        }

        return builder;
    }

    static class IdWrapper {
        public int value = 1;

        public IdWrapper() {
        }

        public IdWrapper(int value) {
            this.value = value;
        }
    }

}
