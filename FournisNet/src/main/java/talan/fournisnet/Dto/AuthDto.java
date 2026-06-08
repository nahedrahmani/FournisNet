package talan.fournisnet.Dto;

public class AuthDto {

    public record LoginRequest(String username, String password) {}

    public record RegisterRequest(String username, String password, String fullName) {}

    public record AuthResponse(String token, String username, String role, String fullName) {}
}
