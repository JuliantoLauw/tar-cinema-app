import { prisma } from "../lib/prisma";

async function main() {
  // Seed Demo Users
  const demoUsers = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123", // TODO: Hash this in production
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "SecurePass456", // TODO: Hash this in production
    },
  ];

  for (const user of demoUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
      console.log(`User ${user.email} berhasil dibuat`);
    } else {
      console.log(`User ${user.email} sudah ada`);
    }
  }

  // Seed Demo Movies
  const demoMovies = [
    { 
      title: 'Kimetsu no Yaiba', 
      poster: 'assets/posters/kimetsu.jpeg', 
      synopsis: 'Sinopsis A', 
      duration: '120m', 
      genre: 'Action', 
      rating: '13+', 
      director: 'Haruo Sotozaki', 
      actors: 'Natsuki Hanae, Akari Kito', 
      trailer: 'https://www.youtube.com/embed/2MKkj1DQ0NU' 
    },
    { 
      title: 'Avenger', 
      poster: 'assets/posters/avenger.jpg', 
      synopsis: 'Sinopsis B', 
      duration: '110m', 
      genre: 'Drama', 
      rating: '17+', 
      director: 'Joss Whedon', 
      actors: 'Robert Downey Jr., Chris Evans, Scarlett Johansson', 
      trailer: 'https://www.youtube.com/embed/eOrNdBpGMv8' 
    },
    { 
      title: 'Avenger Doomsday', 
      poster: 'assets/posters/avengerdoomsday.jpg', 
      synopsis: 'Sinopsis C', 
      duration: '90m', 
      genre: 'Comedy', 
      rating: 'SU', 
      director: 'John Doe', 
      actors: 'Jane Doe, Jack Smith', 
      trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
  ];

  try {
    const created = await prisma.movie.createMany({
      data: demoMovies,
    });

    console.log("Total movie berhasil ditambahkan:", created.count);
  } catch (e) {
    console.log("Movies sudah ada atau error saat insert");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
