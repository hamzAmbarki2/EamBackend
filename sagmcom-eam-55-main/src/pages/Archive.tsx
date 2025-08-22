import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Archive as ArchiveIcon, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Image,
  Video,
  Download,
  Calendar,
  FolderOpen,
  File
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

interface ArchiveDocument {
  identifiantArchive: string;
  nom: string;
  dateArchivage: string;
  type: "DOCUMENT" | "IMAGE" | "VIDEO" | "AUTRE";
  cheminDocument: string;
  taille: string;
  ajoutePar: string;
  description?: string;
}

const Archive = () => {
  const [sidebarSize, setSidebarSize] = useState<"mini" | "compact" | "normal" | "wide">("normal");
  
  const handleSidebarSizeChange = (direction: "prev" | "next") => {
    const sizes = ["mini", "compact", "normal", "wide"] as const;
    const currentIndex = sizes.indexOf(sidebarSize);
    
    if (direction === "next" && currentIndex < sizes.length - 1) {
      setSidebarSize(sizes[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSidebarSize(sizes[currentIndex - 1]);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("tous");

  // Données d'archive basées sur le diagramme de classe
  const archives: ArchiveDocument[] = [
    {
      identifiantArchive: "ARC-001",
      nom: "Manuel_maintenance_ligne_A.pdf",
      dateArchivage: "2024-01-15",
      type: "DOCUMENT",
      cheminDocument: "/documents/manuels/Manuel_maintenance_ligne_A.pdf",
      taille: "2.4 MB",
      ajoutePar: "Jean Dupont",
      description: "Manuel de maintenance pour la ligne de production A"
    },
    {
      identifiantArchive: "ARC-002",
      nom: "Schema_electrique_M205.dwg",
      dateArchivage: "2024-01-18",
      type: "DOCUMENT",
      cheminDocument: "/schemas/electriques/Schema_electrique_M205.dwg",
      taille: "1.8 MB",
      ajoutePar: "Marie Martin",
      description: "Schéma électrique de la machine M-205"
    },
    {
      identifiantArchive: "ARC-003",
      nom: "Video_formation_securite_2024.mp4",
      dateArchivage: "2024-01-20",
      type: "VIDEO",
      cheminDocument: "/videos/formations/Video_formation_securite_2024.mp4",
      taille: "125 MB",
      ajoutePar: "Pierre Dubois",
      description: "Vidéo de formation sécurité mise à jour 2024"
    },
    {
      identifiantArchive: "ARC-004",
      nom: "Photo_incident_ligne_B_20240122.jpg",
      dateArchivage: "2024-01-22",
      type: "IMAGE",
      cheminDocument: "/photos/incidents/Photo_incident_ligne_B_20240122.jpg",
      taille: "3.2 MB",
      ajoutePar: "Sophie Leroy",
      description: "Photo de l'incident sur la ligne B du 22 janvier"
    },
    {
      identifiantArchive: "ARC-005",
      nom: "Backup_config_SCADA_v2.3.bak",
      dateArchivage: "2024-01-10",
      type: "AUTRE",
      cheminDocument: "/backups/scada/Backup_config_SCADA_v2.3.bak",
      taille: "15.7 MB",
      ajoutePar: "Système automatique",
      description: "Sauvegarde de configuration SCADA version 2.3"
    },
    {
      identifiantArchive: "ARC-006",
      nom: "Rapport_audit_ISO9001_2023.pdf",
      dateArchivage: "2024-01-08",
      type: "DOCUMENT",
      cheminDocument: "/documents/audits/Rapport_audit_ISO9001_2023.pdf",
      taille: "4.1 MB",
      ajoutePar: "Auditeur externe",
      description: "Rapport d'audit ISO 9001 année 2023"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DOCUMENT": return <FileText className="w-5 h-5" />;
      case "IMAGE": return <Image className="w-5 h-5" />;
      case "VIDEO": return <Video className="w-5 h-5" />;
      case "AUTRE": return <File className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "DOCUMENT": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "IMAGE": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "VIDEO": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "AUTRE": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredArchives = archives.filter(archive => {
    const matchesSearch = archive.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.identifiantArchive.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (archive.description && archive.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "tous" || archive.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const statsData = [
    {
      title: "Total documents",
      value: archives.length.toString(),
      icon: ArchiveIcon,
      color: "text-blue-400"
    },
    {
      title: "Documents",
      value: archives.filter(a => a.type === "DOCUMENT").length.toString(),
      icon: FileText,
      color: "text-green-400"
    },
    {
      title: "Images",
      value: archives.filter(a => a.type === "IMAGE").length.toString(),
      icon: Image,
      color: "text-purple-400"
    },
    {
      title: "Vidéos",
      value: archives.filter(a => a.type === "VIDEO").length.toString(),
      icon: Video,
      color: "text-orange-400"
    }
  ];

  const totalSize = archives.reduce((acc, archive) => {
    const size = parseFloat(archive.taille);
    const unit = archive.taille.split(' ')[1];
    if (unit === 'GB') return acc + size * 1024;
    if (unit === 'MB') return acc + size;
    if (unit === 'KB') return acc + size / 1024;
    return acc;
  }, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <AdminSidebar sidebarSize={sidebarSize} />
      
      <div className={`transition-all duration-300 ${
        sidebarSize === "mini" ? "ml-16" : 
        sidebarSize === "compact" ? "ml-48" : 
        sidebarSize === "normal" ? "ml-64" : "ml-80"
      }`}>
        <AdminHeader 
          onSidebarSizeChange={handleSidebarSizeChange}
          sidebarSize={sidebarSize}
        />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestion des Archives
                </h1>
                <p className="text-white/70">
                  Stockage et organisation des documents, images et fichiers
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter document
              </Button>
            </div>

            {/* Filtres et recherche */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        placeholder="Rechercher dans les archives..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="DOCUMENT">Documents</option>
                    <option value="IMAGE">Images</option>
                    <option value="VIDEO">Vidéos</option>
                    <option value="AUTRE">Autres</option>
                  </select>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres avancés
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {statsData.map((stat, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <p className="text-white/70 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-white/70 text-sm">Espace utilisé</p>
                      <p className="text-2xl font-bold text-white">{totalSize.toFixed(1)} MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des archives */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Documents archivés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArchives.map((archive) => (
                    <div key={archive.identifiantArchive} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-white/10">
                                {getTypeIcon(archive.type)}
                              </div>
                              <span className="font-semibold text-white">{archive.identifiantArchive}</span>
                            </div>
                            <Badge className={getTypeColor(archive.type)}>
                              {archive.type}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-medium text-white">{archive.nom}</h3>
                          {archive.description && (
                            <p className="text-white/70">{archive.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(archive.dateArchivage).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <span>•</span>
                            <span>Ajouté par: {archive.ajoutePar}</span>
                            <span>•</span>
                            <span>{archive.taille}</span>
                          </div>
                          <div className="text-xs text-white/50 font-mono">
                            {archive.cheminDocument}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-primary hover:bg-primary/80">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            Prévisualiser
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Archive;