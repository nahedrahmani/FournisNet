package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import talan.fournisnet.Dto.AuthDto.*;
import talan.fournisnet.Entities.AppUser;
import talan.fournisnet.Entities.Role;
import talan.fournisnet.Repositories.AppUserRepository;
import talan.fournisnet.Security.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final AppUserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager,
                          AppUserRepository userRepo,
                          PasswordEncoder encoder,
                          JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects."));
        }
        AppUser user = userRepo.findByUsername(req.username()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ce nom d'utilisateur existe deja."));
        }
        AppUser user = new AppUser();
        user.setUsername(req.username());
        user.setPassword(encoder.encode(req.password()));
        user.setFullName(req.fullName());
        user.setRole(Role.USER);
        userRepo.save(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName()));
    }
}
