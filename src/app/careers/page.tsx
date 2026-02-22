'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Briefcase, DollarSign, Send, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs')
        const data = await res.json()
        if (data.jobs) {
          setJobs(data.jobs)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      })

      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setSelectedJob(null)
          setApplicationData({ name: '', email: '', phone: '', coverLetter: '' })
        }, 3000)
      } else {
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Application submission error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4">We're Hiring!</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Be part of building the future of online shopping. We're looking for passionate people to help us create exceptional experiences for millions of customers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Work at CyberShop?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Growth Opportunities',
                desc: 'Advance your career with clear paths for growth and development.',
              },
              {
                icon: Clock,
                title: 'Work-Life Balance',
                desc: 'Flexible schedules, remote options, and generous PTO.',
              },
              {
                icon: DollarSign,
                title: 'Competitive Benefits',
                desc: 'Health insurance, 401(k), stock options, and more.',
              },
              {
                icon: MapPin,
                title: 'Great Locations',
                desc: 'Offices in tech hubs and remote work flexibility.',
              },
              {
                icon: Send,
                title: 'Impact',
                desc: 'Build products used by millions of customers worldwide.',
              },
              {
                icon: Filter,
                title: 'Innovation Culture',
                desc: 'Work with cutting-edge technology and amazing teammates.',
              },
            ].map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-4">
            {jobs.filter(j => j.active).map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {job.description}
                      </p>
                    </div>
                    <Button>
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Apply for {selectedJob.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedJob(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground">
                      Thank you for your interest. We'll review your application and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    {/* Job Details */}
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <h3 className="font-semibold">Position Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p className="font-medium">{selectedJob.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">{selectedJob.type}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Department:</span>
                          <p className="font-medium">{selectedJob.department}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Salary:</span>
                          <p className="font-medium">{selectedJob.salary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Job Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedJob.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedJob.requirements}
                      </p>
                    </div>

                    {/* Application Form */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold">Your Information</h3>

                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={applicationData.name}
                          onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={applicationData.email}
                          onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're interested in this role..."
                          rows={6}
                          value={applicationData.coverLetter}
                          onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground">
                        By submitting, you agree to our{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedJob(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact for Questions */}
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Have Questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our recruiting team is happy to answer any questions about our open positions or the application process.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/contact'}>
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
