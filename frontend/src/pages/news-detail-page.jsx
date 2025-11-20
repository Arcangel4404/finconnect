import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { newsArticles } from '../data/news'

export function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const article = newsArticles.find(a => a.id === parseInt(id))

  if (!article) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Article not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate('/')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card glass className="border-border/50">
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
            <div className="text-8xl">{article.image}</div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">{article.category}</Badge>
            </div>
          </div>

          <CardHeader>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {article.category}
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl mb-4">{article.title}</CardTitle>
            <CardDescription className="text-lg">{article.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose prose-invert max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {article.highlights && article.highlights.length > 0 && (
              <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-lg mb-4">Key Highlights</h3>
                <ul className="space-y-2">
                  {article.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.conclusion && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border/50">
                <h3 className="font-semibold text-lg mb-2">Conclusion</h3>
                <p className="text-muted-foreground leading-relaxed">{article.conclusion}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.article>
    </div>
  )
}
