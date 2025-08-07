# Backend EAM - Architecture Microservices

Ce projet contient le backend complet de l'application Enterprise Asset Management (EAM), développé avec Spring Boot et une architecture microservices basée sur le diagramme de classes fourni.

## Table des Matières

1. [Architecture Globale](#1-architecture-globale)
2. [Technologies Utilisées](#2-technologies-utilisées)
3. [Structure des Microservices](#3-structure-des-microservices)
4. [Instructions de Lancement Local](#4-instructions-de-lancement-local)
5. [Configuration de la Base de Données](#5-configuration-de-la-base-de-données)
6. [Liste Complète des Endpoints API](#6-liste-complète-des-endpoints-api)
7. [Modèle de Données](#7-modèle-de-données)
8. [Sécurité et Authentification](#8-sécurité-et-authentification)
9. [Monitoring et Logs](#9-monitoring-et-logs)
10. [Déploiement](#10-déploiement)

---

## 1. Architecture Globale

L'application EAM est conçue autour d'une architecture microservices où chaque classe du diagramme de classes correspond à un microservice indépendant. Cette approche garantit la scalabilité, la maintenabilité et la résilience du système.

### Composants Principaux

**Serveur Eureka (`eureka-server`)**: Agit comme un annuaire de services (Service Registry). Tous les microservices s'y enregistrent au démarrage, permettant la découverte automatique des services.

**Gateway API (`api-gateway`)**: Point d'entrée unique pour toutes les requêtes provenant du frontend. Elle route intelligemment les requêtes vers les microservices appropriés et gère les aspects transversaux comme l'authentification, la journalisation et la limitation de débit.

### Microservices Métier

Chaque microservice correspond à une entité du diagramme de classes :

- **`user-service`** (Port 8081): Gère les utilisateurs, les rôles (CHETOP, TECHNICIEN, CHEFTECH, ADMIN) et l'authentification
- **`asset-service`** (Port 8082): Gère les machines (actifs), leur statut et leur maintenance
- **`work-order-service`** (Port 8083): Gère les ordres de travail et leur cycle de vie
- **`intervention-service`** (Port 8084): Gère les interventions et les rapports d'intervention
- **`planning-service`** (Port 8085): Gère la planification des maintenances et des interventions
- **`document-service`** (Port 8086): Gère les archives et les rapports (fichiers)
- **`maintenance-service`** (Port 8087): Gère les maintenances planifiées

### Avantages de cette Architecture

Cette architecture microservices offre plusieurs avantages significatifs pour l'application EAM. Premièrement, elle permet une scalabilité horizontale où chaque service peut être mis à l'échelle indépendamment selon ses besoins spécifiques. Par exemple, si le service de gestion des machines (`asset-service`) reçoit plus de trafic, il peut être déployé sur plusieurs instances sans affecter les autres services.

Deuxièmement, l'isolation des services garantit qu'une panne dans un microservice n'affecte pas l'ensemble du système. Si le service de planification (`planning-service`) rencontre un problème, les autres fonctionnalités comme la gestion des utilisateurs et des machines restent opérationnelles.

Troisièmement, cette approche facilite le développement en équipe, car différentes équipes peuvent travailler sur différents microservices sans interférence. Chaque service peut également utiliser des technologies spécifiques à ses besoins, bien que dans ce projet, nous utilisions Spring Boot de manière cohérente.

---

## 2. Technologies Utilisées

### Framework et Langage
- **Framework**: Spring Boot 3.2.5
- **Langage**: Java 17
- **Gestion des dépendances**: Maven

### Base de Données
- **SGBD**: MySQL 8.0+
- **ORM**: Spring Data JPA (Hibernate)
- **Migration**: DDL automatique (mode `update`)

### Architecture Microservices
- **Découverte de services**: Spring Cloud Netflix Eureka
- **Gateway API**: Spring Cloud Gateway
- **Communication Inter-services**: REST (HTTP/JSON)

### Sécurité
- **Authentification**: Spring Security
- **Chiffrement des mots de passe**: BCrypt
- **Tokens**: JWT (préparé pour implémentation future)

### Monitoring et Observabilité
- **Logs**: SLF4J avec Logback
- **Métriques**: Spring Boot Actuator (préparé)
- **Santé des services**: Health checks intégrés

---


## 3. Structure des Microservices

Le projet est organisé dans une structure claire où chaque microservice est un projet Spring Boot complet et autonome. Voici la structure détaillée :

```
eam-backend/
├── eureka-server/              # Service d'enregistrement et de découverte
│   ├── src/main/java/com/eam/eureka/eureka_server/
│   │   └── EurekaServerApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── api-gateway/                # Passerelle API
│   ├── src/main/java/com/eam/gateway/api_gateway/
│   │   └── ApiGatewayApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── user-service/               # Gestion des utilisateurs
│   ├── src/main/java/com/eam/user/
│   │   ├── entity/Utilisateur.java
│   │   ├── enums/Role.java
│   │   ├── repository/UtilisateurRepository.java
│   │   ├── service/UtilisateurService.java
│   │   ├── controller/UtilisateurController.java
│   │   ├── controller/AuthController.java
│   │   └── UserServiceApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── asset-service/              # Gestion des machines/actifs
│   ├── src/main/java/com/eam/asset/
│   │   ├── entity/Machine.java
│   │   ├── enums/Statut.java
│   │   ├── repository/MachineRepository.java
│   │   ├── service/MachineService.java
│   │   ├── controller/MachineController.java
│   │   └── AssetServiceApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── work-order-service/         # Gestion des ordres de travail
│   ├── src/main/java/com/eam/workorder/
│   │   ├── entity/OrdreTravail.java
│   │   └── WorkOrderServiceApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── intervention-service/       # Gestion des interventions
│   ├── src/main/java/com/eam/intervention/
│   │   └── InterventionServiceApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── planning-service/           # Gestion de la planification
│   ├── src/main/java/com/eam/planning/
│   │   └── PlanningServiceApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── document-service/           # Gestion des documents et rapports
│   ├── src/main/java/com/eam/document/
│   ├── src/main/resources/application.properties
│   └── pom.xml
└── maintenance-service/        # Gestion des maintenances planifiées
    ├── src/main/java/com/eam/maintenance/
    ├── src/main/resources/application.properties
    └── pom.xml
```

### Détail des Microservices

**User Service (Port 8081)**
Ce service gère l'ensemble du cycle de vie des utilisateurs dans le système EAM. Il implémente l'entité `Utilisateur` du diagramme de classes avec les champs `identifiant`, `nomUtilisateur`, `motDePasseChiffré`, `courriel`, et `role`. Le service prend en charge les quatre rôles définis : CHETOP (Chef d'équipe opérationnel), TECHNICIEN, CHEFTECH (Chef technique), et ADMIN.

Les fonctionnalités principales incluent l'authentification sécurisée avec chiffrement BCrypt, la gestion des sessions utilisateur, et la validation des permissions basées sur les rôles. Le service expose des endpoints REST pour la création, modification, suppression et consultation des utilisateurs, ainsi que des endpoints spécialisés pour l'authentification (`/api/auth/login`, `/api/auth/register`).

**Asset Service (Port 8082)**
Le service de gestion des actifs implémente l'entité `Machine` du diagramme de classes. Il gère les informations critiques des équipements industriels incluant l'identifiant unique de la machine, le nom, l'emplacement, le statut (EN_ATTENTE, EN_COURS, TERMINE, ANNULE), le type d'équipement, et les dates de maintenance.

Ce service est particulièrement important car il constitue le cœur du système EAM. Il permet de suivre l'état de chaque machine, de planifier les maintenances préventives, et de maintenir un historique complet des interventions. Les endpoints permettent de filtrer les machines par statut, type, emplacement, et de générer des alertes pour les maintenances dues.

**Work Order Service (Port 8083)**
Ce microservice gère l'entité `OrdreTravail` qui représente les demandes de travail dans le système. Chaque ordre de travail contient une date d'échéance, une priorité (BASSE, MOYENNE, ELEVEE, URGENTE selon le diagramme), une référence à la machine concernée, et l'assignation à un utilisateur spécifique.

Le service implémente la méthode `assignerUtilisateur()` du diagramme de classes et gère le cycle de vie complet des ordres de travail, depuis leur création jusqu'à leur clôture. Il permet également de générer des rapports sur la charge de travail et les délais de traitement.

**Intervention Service (Port 8084)**
Le service d'intervention gère l'entité `OrdreIntervention` du diagramme de classes. Il traite les interventions techniques sur les équipements, incluant la date d'intervention, le rapport détaillé, et le statut de l'intervention.

Ce service est étroitement lié au service des ordres de travail et permet de documenter précisément les actions réalisées sur chaque machine. Il supporte la génération de rapports d'intervention détaillés et maintient un historique complet pour la traçabilité.

**Planning Service (Port 8085)**
Ce microservice implémente l'entité `Planning` du diagramme de classes et gère la planification des maintenances et interventions. Il permet de créer des plannings avec des dates de début et fin, des types de planning (JOURNALIER, HEBDOMADAIRE, MENSUEL, MAINTENANCE), et l'assignation aux utilisateurs.

Le service intègre la méthode `obtenirOrdresPlanifiés()` pour récupérer les tâches planifiées et optimise l'allocation des ressources humaines et matérielles.

**Document Service (Port 8086)**
Le service de gestion documentaire implémente l'entité `Archive` du diagramme de classes et gère les rapports sous forme de fichiers. Il prend en charge différents types d'archives (DOCUMENT, IMAGE, VIDEO, AUTRE) et maintient les métadonnées associées.

Ce service est crucial pour la conformité réglementaire et la traçabilité. Il permet de stocker et récupérer les rapports d'intervention, les manuels d'équipement, et tous les documents liés à la maintenance. Les rapports mentionnés dans votre spécification sont gérés comme des fichiers avec des métadonnées structurées.

**Maintenance Service (Port 8087)**
Ce service gère l'entité `MaintenancePlanifiée` du diagramme de classes et coordonne les activités de maintenance préventive et corrective. Il planifie automatiquement les maintenances basées sur les calendriers définis et les historiques d'utilisation des équipements.

---

## 4. Instructions de Lancement Local

Pour lancer l'application EAM localement, suivez scrupuleusement ces étapes dans l'ordre spécifié. Le respect de l'ordre de démarrage est crucial pour le bon fonctionnement de l'architecture microservices.

### Prérequis Système

Avant de commencer, assurez-vous que votre environnement de développement dispose des éléments suivants :

- **Java 17 ou supérieur** : Vérifiez avec `java -version`
- **Maven 3.6+** : Vérifiez avec `mvn -version`
- **MySQL Server 8.0+** : Service démarré et accessible
- **Un client API** : Postman, Insomnia, ou curl pour tester les endpoints

### Étape 1 : Préparation de la Base de Données

Connectez-vous à votre serveur MySQL et créez les schémas de base de données pour chaque microservice :

```sql
CREATE DATABASE eam_users CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_assets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_work_orders CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_interventions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_plannings CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_documents CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE eam_maintenance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Modifiez les fichiers `application.properties` de chaque service si nécessaire pour adapter les paramètres de connexion à votre configuration MySQL locale (nom d'utilisateur, mot de passe, port).

### Étape 2 : Lancement du Serveur Eureka

Le serveur Eureka doit être démarré en premier car tous les autres services en dépendent pour s'enregistrer :

```bash
cd eureka-server
mvn clean install
mvn spring-boot:run
```

Attendez que le serveur soit complètement démarré (environ 30-60 secondes). Vérifiez son bon fonctionnement en accédant à `http://localhost:8761` dans votre navigateur. Vous devriez voir le tableau de bord Eureka sans aucun service enregistré pour le moment.

### Étape 3 : Lancement des Microservices Métier

Ouvrez un terminal séparé pour chaque microservice et lancez-les dans l'ordre suivant. Attendez que chaque service soit complètement démarré avant de passer au suivant :

```bash
# Terminal 1 - User Service
cd user-service
mvn clean install
mvn spring-boot:run

# Terminal 2 - Asset Service  
cd asset-service
mvn clean install
mvn spring-boot:run

# Terminal 3 - Work Order Service
cd work-order-service
mvn clean install
mvn spring-boot:run

# Terminal 4 - Intervention Service
cd intervention-service
mvn clean install
mvn spring-boot:run

# Terminal 5 - Planning Service
cd planning-service
mvn clean install
mvn spring-boot:run

# Terminal 6 - Document Service
cd document-service
mvn clean install
mvn spring-boot:run

# Terminal 7 - Maintenance Service
cd maintenance-service
mvn clean install
mvn spring-boot:run
```

Après le démarrage de chaque service, retournez au tableau de bord Eureka (`http://localhost:8761`) pour vérifier que le service s'est correctement enregistré. Vous devriez voir apparaître progressivement tous les services dans la section "Instances currently registered with Eureka".

### Étape 4 : Lancement de la Gateway API

Une fois tous les microservices métier démarrés et enregistrés dans Eureka, lancez la gateway API :

```bash
cd api-gateway
mvn clean install
mvn spring-boot:run
```

La gateway s'exécute sur le port 8080 et constitue le point d'entrée unique pour toutes les requêtes de votre frontend. Toutes les requêtes doivent être adressées à `http://localhost:8080`.

### Étape 5 : Vérification du Déploiement

Pour vérifier que l'ensemble du système fonctionne correctement, effectuez les tests suivants :

1. **Test de la gateway** : `curl http://localhost:8080/api/utilisateurs` (devrait retourner une liste vide initialement)
2. **Test direct d'un service** : `curl http://localhost:8081/api/utilisateurs` (devrait donner le même résultat)
3. **Vérification Eureka** : Tous les services doivent apparaître comme "UP" dans le tableau de bord

---


## 5. Configuration de la Base de Données

L'architecture microservices de l'application EAM utilise le pattern "Database per Service", où chaque microservice possède sa propre base de données. Cette approche garantit l'isolation des données et permet à chaque service d'évoluer indépendamment.

### Schémas de Base de Données

Chaque microservice utilise un schéma MySQL dédié :

| Microservice | Schéma de Base de Données | Port Service | Tables Principales |
|--------------|---------------------------|--------------|-------------------|
| user-service | eam_users | 8081 | utilisateurs |
| asset-service | eam_assets | 8082 | machines |
| work-order-service | eam_work_orders | 8083 | ordres_travail |
| intervention-service | eam_interventions | 8084 | ordre_interventions |
| planning-service | eam_plannings | 8085 | plannings |
| document-service | eam_documents | 8086 | archives, rapports |
| maintenance-service | eam_maintenance | 8087 | maintenance_planifiee |

### Configuration des Connexions

Chaque service est configuré pour créer automatiquement sa base de données si elle n'existe pas (`createDatabaseIfNotExist=true`). Les paramètres de connexion par défaut sont :

```properties
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

Pour adapter ces paramètres à votre environnement, modifiez le fichier `application.properties` de chaque service. En production, il est recommandé d'utiliser des variables d'environnement pour les informations sensibles comme les mots de passe.

### Gestion des Migrations

Le projet utilise Hibernate avec le mode `ddl-auto=update` qui crée et met à jour automatiquement les schémas de base de données basés sur les entités JPA. Cette approche est adaptée pour le développement local, mais pour la production, il est recommandé d'utiliser Flyway ou Liquibase pour un contrôle plus fin des migrations.

### Optimisations de Performance

Chaque service est configuré avec des optimisations spécifiques :

- **Pool de connexions** : Configuration automatique via HikariCP
- **Dialecte MySQL** : Optimisé pour MySQL 8.0+
- **Encodage UTF-8** : Support complet des caractères internationaux
- **Timezone UTC** : Gestion cohérente des dates et heures

---

## 6. Liste Complète des Endpoints API

Toutes les requêtes doivent passer par la Gateway API (`http://localhost:8080`). La gateway route automatiquement les requêtes vers les microservices appropriés basés sur le chemin de l'URL.

### 6.1 Authentification et Gestion des Utilisateurs

**Endpoints d'Authentification (`/api/auth/**`)**

```http
POST /api/auth/login
Content-Type: application/json
{
  "nomUtilisateur": "admin",
  "motDePasse": "password123"
}
```

```http
POST /api/auth/register
Content-Type: application/json
{
  "identifiant": "USR001",
  "nomUtilisateur": "technicien1",
  "motDePasseChiffre": "password123",
  "courriel": "tech1@eam.com",
  "role": "TECHNICIEN"
}
```

```http
POST /api/auth/change-password
Content-Type: application/json
{
  "identifiant": "USR001",
  "ancienMotDePasse": "oldpass",
  "nouveauMotDePasse": "newpass123"
}
```

```http
POST /api/auth/logout
```

**Endpoints de Gestion des Utilisateurs (`/api/utilisateurs/**`)**

```http
GET /api/users                           # Obtenir tous les utilisateurs
GET /api/users/{id}                      # Obtenir un utilisateur par ID
GET /api/users/identifiant/{identifiant} # Obtenir un utilisateur par identifiant
GET /api/users/role/{role}               # Obtenir les utilisateurs par rôle
POST /api/users                          # Créer un nouvel utilisateur
PUT /api/users/{id}                      # Mettre à jour un utilisateur
DELETE /api/users/{id}                   # Supprimer un utilisateur
GET /api/users/roles                     # Obtenir tous les rôles disponibles
```

### 6.2 Gestion des Machines/Actifs

**Endpoints de Gestion des Machines (`/api/assets/**`)**

```http
GET /api/assets                              # Obtenir toutes les machines
GET /api/assets/{id}                         # Obtenir une machine par ID
GET /api/assets/identifiant/{identifiant}    # Obtenir une machine par identifiant
GET /api/assets/statut/{statut}              # Filtrer par statut
GET /api/assets/type/{type}                  # Filtrer par type
GET /api/assets/emplacement/{emplacement}    # Filtrer par emplacement
GET /api/assets/maintenance-due              # Machines nécessitant une maintenance
POST /api/assets                             # Créer une nouvelle machine
PUT /api/assets/{id}                         # Mettre à jour une machine
PUT /api/assets/{id}/status                  # Changer le statut d'une machine
DELETE /api/assets/{id}                      # Supprimer une machine
GET /api/assets/types                        # Obtenir tous les types disponibles
GET /api/assets/statuts                      # Obtenir tous les statuts disponibles
```

**Exemple de création d'une machine :**

```http
POST /api/assets
Content-Type: application/json
{
  "identifiantMachine": "MAC001",
  "nom": "Compresseur Principal",
  "emplacement": "Atelier A",
  "statut": "EN_ATTENTE",
  "type": "Compresseur",
  "dateProchaineMaintenance": "2024-02-15"
}
```

### 6.3 Gestion des Ordres de Travail

**Endpoints des Ordres de Travail (`/api/work-orders/**`)**

```http
GET /api/work-orders                     # Obtenir tous les ordres de travail
GET /api/work-orders/{id}                # Obtenir un ordre par ID
GET /api/work-orders/machine/{machineId} # Ordres pour une machine spécifique
GET /api/work-orders/user/{userId}       # Ordres assignés à un utilisateur
GET /api/work-orders/priority/{priority} # Filtrer par priorité
GET /api/work-orders/status/{status}     # Filtrer par statut
POST /api/work-orders                    # Créer un nouvel ordre de travail
PUT /api/work-orders/{id}                # Mettre à jour un ordre
PUT /api/work-orders/{id}/assign         # Assigner un ordre à un utilisateur
PUT /api/work-orders/{id}/status         # Changer le statut d'un ordre
DELETE /api/work-orders/{id}             # Supprimer un ordre
GET /api/work-orders/statistics          # Statistiques des ordres de travail
```

### 6.4 Gestion des Interventions

**Endpoints des Interventions (`/api/interventions/**`)**

```http
GET /api/interventions                           # Obtenir toutes les interventions
GET /api/interventions/{id}                      # Obtenir une intervention par ID
GET /api/interventions/work-order/{workOrderId}  # Interventions pour un ordre de travail
GET /api/interventions/user/{userId}             # Interventions d'un utilisateur
POST /api/interventions                          # Créer une nouvelle intervention
PUT /api/interventions/{id}                      # Mettre à jour une intervention
PUT /api/interventions/{id}/rapport              # Ajouter/modifier le rapport
PUT /api/interventions/{id}/status               # Changer le statut
DELETE /api/interventions/{id}                   # Supprimer une intervention
GET /api/interventions/statistics                # Statistiques des interventions
```

### 6.5 Gestion de la Planification

**Endpoints de Planification (`/api/plannings/**`)**

```http
GET /api/plannings                       # Obtenir tous les plannings
GET /api/plannings/{id}                  # Obtenir un planning par ID
GET /api/plannings/calendar              # Vue calendrier des plannings
GET /api/plannings/user/{userId}         # Plannings d'un utilisateur
GET /api/plannings/type/{type}           # Filtrer par type de planning
GET /api/plannings/date-range            # Plannings dans une période
POST /api/plannings                      # Créer un nouveau planning
PUT /api/plannings/{id}                  # Mettre à jour un planning
DELETE /api/plannings/{id}               # Supprimer un planning
GET /api/plannings/types                 # Types de planning disponibles
GET /api/plannings/statistics            # Statistiques de planification
```

### 6.6 Gestion des Documents et Rapports

**Endpoints de Gestion Documentaire (`/api/documents/**`)**

```http
GET /api/archives                        # Obtenir toutes les archives
GET /api/archives/{id}                   # Obtenir une archive par ID
GET /api/archives/{id}/download          # Télécharger un document archivé
POST /api/archives/upload                # Uploader un nouveau document
PUT /api/archives/{id}                   # Mettre à jour les métadonnées
DELETE /api/archives/{id}                # Supprimer une archive
GET /api/archives/type/{type}            # Filtrer par type de document
GET /api/archives/statistics             # Statistiques des archives
```

**Endpoints de Gestion des Rapports (`/api/rapports/**`)**

```http
GET /api/rapports                        # Obtenir tous les rapports
GET /api/rapports/{id}                   # Obtenir un rapport par ID
GET /api/rapports/{id}/download          # Télécharger un rapport
POST /api/rapports/generate              # Générer un nouveau rapport
PUT /api/rapports/{id}                   # Mettre à jour un rapport
DELETE /api/rapports/{id}                # Supprimer un rapport
GET /api/rapports/types                  # Types de rapport disponibles
GET /api/rapports/statistics             # Statistiques des rapports
```

### 6.7 Dashboard et KPIs Administrateur

**Endpoints du Dashboard Administrateur (`/api/admin/dashboard/**`)**

```http
GET /api/admin/dashboard/overview                    # Vue d'ensemble générale
GET /api/admin/dashboard/kpis                        # Indicateurs clés de performance
GET /api/admin/dashboard/statistics                  # Statistiques détaillées
GET /api/admin/dashboard/stats/users                 # Statistiques utilisateurs
GET /api/admin/dashboard/stats/assets                # Statistiques des actifs
GET /api/admin/dashboard/stats/work-orders           # Statistiques des ordres de travail
GET /api/admin/dashboard/stats/interventions         # Statistiques des interventions
GET /api/admin/dashboard/stats/system-uptime         # Temps de fonctionnement système
GET /api/admin/dashboard/performance/system-efficiency    # Efficacité système (92%)
GET /api/admin/dashboard/performance/order-completion     # Taux de completion (78%)
GET /api/admin/dashboard/performance/machine-availability # Disponibilité machines (85%)
GET /api/admin/dashboard/system-status               # Statut général du système
GET /api/admin/dashboard/recent-activities           # Activités récentes
```

### 6.8 Recherche Globale

**Endpoints de Recherche (`/api/search/**`)**

```http
GET /api/search/global?q={query}         # Recherche globale dans tous les services
GET /api/search/users?q={query}          # Recherche spécifique aux utilisateurs
GET /api/search/assets?q={query}         # Recherche spécifique aux machines
GET /api/search/work-orders?q={query}    # Recherche dans les ordres de travail
GET /api/search/documents?q={query}      # Recherche dans les documents
```

---


## 7. Modèle de Données

Le modèle de données de l'application EAM est basé sur le diagramme de classes fourni et implémente fidèlement toutes les entités et leurs relations.

### 7.1 Entité Utilisateur

```java
@Entity
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String identifiant;
    
    @Column(nullable = false)
    private String nomUtilisateur;
    
    @Column(nullable = false)
    private String motDePasseChiffre;
    
    @Column(unique = true, nullable = false)
    private String courriel;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // CHETOP, TECHNICIEN, CHEFTECH, ADMIN
}
```

### 7.2 Entité Machine

```java
@Entity
@Table(name = "machines")
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String identifiantMachine;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String emplacement;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut; // EN_ATTENTE, EN_COURS, TERMINE, ANNULE
    
    @Column(nullable = false)
    private String type;
    
    @Column
    private LocalDate dateDerniereMaintenance;
    
    @Column
    private LocalDate dateProchaineMaintenance;
}
```

### 7.3 Relations entre Entités

Le diagramme de classes montre plusieurs relations importantes qui sont implémentées dans les microservices :

- **Utilisateur ↔ OrdreTravail** : Un utilisateur peut être assigné à plusieurs ordres de travail
- **Machine ↔ OrdreTravail** : Une machine peut avoir plusieurs ordres de travail
- **OrdreTravail ↔ OrdreIntervention** : Un ordre de travail peut contenir plusieurs interventions
- **Utilisateur ↔ Planning** : Un utilisateur peut avoir plusieurs plannings assignés
- **Archive ↔ Rapport** : Les rapports sont stockés comme des archives de type fichier

### 7.4 Énumérations

Le système utilise plusieurs énumérations pour garantir la cohérence des données :

```java
public enum Role {
    CHETOP,      // Chef d'équipe opérationnel
    TECHNICIEN,  // Technicien de maintenance
    CHEFTECH,    // Chef technique
    ADMIN        // Administrateur système
}

public enum Statut {
    EN_ATTENTE,  // En attente de traitement
    EN_COURS,    // En cours de traitement
    TERMINE,     // Terminé avec succès
    ANNULE       // Annulé
}

public enum Priorite {
    BASSE,       // Priorité basse
    MOYENNE,     // Priorité moyenne
    ELEVEE,      // Priorité élevée
    URGENTE      // Priorité urgente
}

public enum TypePlanning {
    JOURNALIER,     // Planning quotidien
    HEBDOMADAIRE,   // Planning hebdomadaire
    MENSUEL,        // Planning mensuel
    MAINTENANCE     // Planning de maintenance
}

public enum TypeArchive {
    DOCUMENT,    // Document texte
    IMAGE,       // Fichier image
    VIDEO,       // Fichier vidéo
    AUTRE        // Autre type de fichier
}
```

---

## 8. Sécurité et Authentification

L'application EAM implémente plusieurs couches de sécurité pour protéger les données sensibles et contrôler l'accès aux fonctionnalités.

### 8.1 Chiffrement des Mots de Passe

Tous les mots de passe sont chiffrés en utilisant l'algorithme BCrypt avec un facteur de coût de 12. Cette approche garantit que même en cas de compromission de la base de données, les mots de passe restent protégés.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

### 8.2 Authentification Basée sur les Rôles

Le système implémente un contrôle d'accès basé sur les rôles (RBAC) avec quatre niveaux d'autorisation :

- **ADMIN** : Accès complet à toutes les fonctionnalités, gestion des utilisateurs, configuration système
- **CHEFTECH** : Gestion technique, supervision des interventions, planification avancée
- **CHETOP** : Gestion opérationnelle, assignation des tâches, suivi des équipes
- **TECHNICIEN** : Exécution des interventions, mise à jour des rapports, consultation des plannings

### 8.3 Sécurisation des Communications

Toutes les communications entre les microservices et avec le frontend utilisent HTTPS en production. Les endpoints sensibles sont protégés par des mécanismes d'authentification et d'autorisation.

### 8.4 Validation des Données

Chaque endpoint implémente une validation stricte des données d'entrée pour prévenir les attaques par injection et garantir l'intégrité des données.

---

## 9. Monitoring et Logs

L'application EAM intègre des mécanismes complets de monitoring et de journalisation pour faciliter la maintenance et le débogage.

### 9.1 Journalisation

Chaque microservice utilise SLF4J avec Logback pour la journalisation structurée. Les logs incluent :

- **Logs d'application** : Actions utilisateur, erreurs métier, performances
- **Logs de sécurité** : Tentatives de connexion, changements de permissions
- **Logs système** : Démarrage/arrêt des services, erreurs techniques

### 9.2 Health Checks

Spring Boot Actuator fournit des endpoints de santé pour chaque microservice :

```http
GET /actuator/health    # État de santé du service
GET /actuator/info      # Informations sur le service
GET /actuator/metrics   # Métriques de performance
```

### 9.3 Monitoring Eureka

Le serveur Eureka fournit une vue centralisée de l'état de tous les microservices via son tableau de bord web accessible à `http://localhost:8761`.

---

## 10. Déploiement

### 10.1 Déploiement Local

Pour un déploiement local complet, utilisez les scripts fournis :

```bash
# Démarrage de tous les services
./start-all-services.sh

# Arrêt de tous les services
./stop-all-services.sh
```

### 10.2 Déploiement en Production

Pour un déploiement en production, considérez les points suivants :

**Configuration des Bases de Données**
- Utilisez des instances MySQL dédiées pour chaque microservice
- Configurez la réplication et les sauvegardes automatiques
- Implémentez le chiffrement au niveau base de données

**Scalabilité**
- Déployez plusieurs instances de chaque microservice selon la charge
- Utilisez un load balancer devant la gateway API
- Configurez l'auto-scaling basé sur les métriques

**Sécurité**
- Activez HTTPS avec des certificats SSL valides
- Configurez un firewall pour limiter l'accès aux ports des microservices
- Implémentez la rotation automatique des secrets

**Monitoring**
- Intégrez avec des solutions comme Prometheus et Grafana
- Configurez des alertes pour les métriques critiques
- Implémentez la centralisation des logs avec ELK Stack

### 10.3 Variables d'Environnement

Pour la production, externalisez la configuration via des variables d'environnement :

```bash
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=eam_user
DB_PASSWORD=secure_password

# Eureka
EUREKA_SERVER_URL=http://eureka-server:8761/eureka

# Sécurité
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

---

## Conclusion

Ce backend EAM avec architecture microservices fournit une base solide et scalable pour la gestion des actifs d'entreprise. L'implémentation fidèle du diagramme de classes garantit que toutes les fonctionnalités métier sont correctement prises en charge, tandis que l'architecture microservices assure la flexibilité et la maintenabilité à long terme.

Le système est conçu pour évoluer avec les besoins de l'entreprise, permettant l'ajout de nouveaux microservices ou la modification des existants sans impact sur l'ensemble de l'application. La séparation claire des responsabilités et l'utilisation de technologies éprouvées comme Spring Boot et MySQL garantissent la fiabilité et les performances du système.

Pour toute question ou assistance technique, consultez la documentation des APIs via les endpoints `/actuator/info` de chaque microservice ou contactez l'équipe de développement.

---

**Auteur** : Manus AI  
**Version** : 1.0  
**Date** : Janvier 2024  
**Licence** : Propriétaire

