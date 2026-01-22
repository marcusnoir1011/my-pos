import { prisma } from "../../libs/prisma";

class AuthService {
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
}

export default new AuthService();
