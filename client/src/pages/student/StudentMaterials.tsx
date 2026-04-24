import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import api from '@/lib/api'
import { Material, MaterialType } from '@/types'
import { Package, FileText, Video, Link2, Image, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const typeIcons: Record<MaterialType, React.ElementType> = {
  DOCUMENT: FileText, VIDEO: Video, LINK: Link2, IMAGE: Image
}
const typeLabels: Record<MaterialType, string> = {
  DOCUMENT: 'Документ', VIDEO: 'Видео', LINK: 'Ссылка', IMAGE: 'Изображение'
}

export default function StudentMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/materials').then(r => setMaterials(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const personal = materials.filter(m => m.studentId)
  const shared = materials.filter(m => !m.studentId)

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Учебные материалы" description={`${materials.length} материалов`} />

      {materials.length === 0 ? (
        <EmptyState icon={Package} title="Нет материалов" description="Репетитор добавит материалы после занятий" />
      ) : (
        <>
          {personal.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Ваши материалы</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {personal.map(m => <MaterialCard key={m.id} material={m} />)}
              </div>
            </div>
          )}
          {shared.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Общие материалы</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {shared.map(m => <MaterialCard key={m.id} material={m} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MaterialCard({ material: m }: { material: Material }) {
  const Icon = typeIcons[m.type]
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{m.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{typeLabels[m.type]}</Badge>
              {m.subject && <span className="text-xs text-muted-foreground">{m.subject}</span>}
            </div>
          </div>
        </div>
        {m.description && <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{m.description}</p>}
        {m.url && (
          <div className="mt-4">
            <a href={m.url} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="w-full text-xs">
                <ExternalLink className="h-3 w-3 mr-1.5" />Открыть материал
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
