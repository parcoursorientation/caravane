import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with sample exposants...')

  // Delete existing exposants
  await prisma.exposant.deleteMany()

  // Create sample exposants
  const exposants = await Promise.all([
    prisma.exposant.create({
      data: {
        nom: "École Supérieure d'Ingénierie de Tanger",
        description: "Première école d'ingénieurs privée du Nord du Maroc, offrant des formations d'excellence dans les domaines de l'informatique, du génie civil et des télécommunications.",
        domaine: "Ingénierie",
        siteWeb: "https://esit.ma",
        statutPaiement: "PAYE"
      }
    }),
    prisma.exposant.create({
      data: {
        nom: "Institut de Commerce International",
        description: "Établissement de référence pour la formation en commerce et gestion. Nous préparons les futurs cadres et entrepreneurs aux défis du monde des affaires.",
        domaine: "Commerce",
        siteWeb: "https://ici-tanger.ma",
        statutPaiement: "PAYE"
      }
    }),
    prisma.exposant.create({
      data: {
        nom: "École des Beaux-Arts de Tanger",
        description: "Institution prestigieuse dédiée aux formations artistiques et créatives. Nous offrons des cursus en design graphique, architecture d'intérieur et arts plastiques.",
        domaine: "Art",
        siteWeb: "https://ebat.ma",
        statutPaiement: "PAYE"
      }
    }),
    prisma.exposant.create({
      data: {
        nom: "Institut Technologique du Nord",
        description: "Centre de formation professionnelle aux nouvelles technologies. Nous formons les techniciens et ingénieurs de demain dans les domaines du numérique.",
        domaine: "Technologie",
        siteWeb: "https://itn.ma",
        statutPaiement: "EN_ATTENTE"
      }
    })
  ])

  console.log(`Created ${exposants.length} exposants:`)
  exposants.forEach(exposant => {
    console.log(`- ${exposant.nom} (${exposant.domaine}) - Statut: ${exposant.statutPaiement} - ID: ${exposant.id}`)
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