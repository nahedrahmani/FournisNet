package talan.fournisnet.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import talan.fournisnet.Entities.AppUser;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
