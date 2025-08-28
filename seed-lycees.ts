import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with sample lycees...')

  // Delete existing lycees
  await prisma.lycee.deleteMany()

  // Create sample lycees
  const lycees = await Promise.all([
    prisma.lycee.create({
      data: {
        nom: "Lycée Ibn Battouta",
        adresse: "Avenue Mohammed VI, Tanger 90000",
        type: "PUBLIC",
        description: "L'un des plus anciens et prestigieux lycées de Tanger, connu pour son excellence académique et ses installations modernes."
      }
    }),
    prisma.lycee.create({
      data: {
        nom: "Lycée Ibn Khaldoun",
        adresse: "Rue de la Liberté, Tanger 90000",
        type: "PUBLIC",
        description: "Établissement public réputé pour son enseignement scientifique et technologique."
      }
    }),
    prisma.lycee.create({
      data: {
        nom: "Lycée Privé Al Amal",
        adresse: "Boulevard Pasteur, Tanger 90000",
        type: "PRIVE",
        description: "Institution privée d'excellence offrant un enseignement bilingue et des programmes internationaux."
      }
    })
  ])

  console.log(`Created ${lycees.length} lycees:`)
  lycees.forEach(lycee => {
    console.log(`- ${lycee.nom} (${lycee.type}) - ID: ${lycee.id}`)
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })