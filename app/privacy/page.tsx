"use client"

import { StarField } from "@/components/star-field"
import { useLanguage } from "@/lib/i18n/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.privacy.title}</h1>
          <p className="text-muted-foreground">{t.privacy.subtitle}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Section 1: Data Controller */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section1.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section1.intro}</p>
            <address className="not-italic text-foreground bg-background/30 p-4 rounded-lg">
              <strong>{t.privacy.section1.company}</strong>
              <br />
              {t.privacy.section1.name}
              <br />
              {t.privacy.section1.address1}
              <br />
              {t.privacy.section1.address2}
              <br />
              {t.privacy.section1.country}
              <br />
              <br />
              E-Mail:{" "}
              <a href={`mailto:${t.privacy.section1.email}`} className="text-primary hover:underline">
                {t.privacy.section1.email}
              </a>
            </address>
          </section>

          {/* Section 2: Principles */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section2.title}</h2>
            <p className="text-muted-foreground">{t.privacy.section2.content}</p>
          </section>

          {/* Section 3: What Data */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section3.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section3.intro}</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">{t.privacy.section3.masterData.title}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {t.privacy.section3.masterData.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {t.privacy.section3.transactionData.title}
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {t.privacy.section3.transactionData.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {t.privacy.section3.technicalData.title}
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {t.privacy.section3.technicalData.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 4: Purpose and Legal Basis */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section4.title}</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t.privacy.section4.contractFulfillment.title}
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {t.privacy.section4.contractFulfillment.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t.privacy.section4.legitimateInterest.title}
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {t.privacy.section4.legitimateInterest.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t.privacy.section4.consent.title}</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {t.privacy.section4.consent.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Data Sharing */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section5.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section5.intro}</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {t.privacy.section5.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>{t.privacy.section5.noSale}</strong>
            </p>
          </section>

          {/* Section 6: Storage Duration */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section6.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section6.intro}</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <strong>{t.privacy.section6.membership}</strong> {t.privacy.section6.membershipDuration}
              </li>
              <li>
                <strong>{t.privacy.section6.transaction}</strong> {t.privacy.section6.transactionDuration}
              </li>
              <li>
                <strong>{t.privacy.section6.newsletter}</strong> {t.privacy.section6.newsletterDuration}
              </li>
              <li>
                <strong>{t.privacy.section6.technical}</strong> {t.privacy.section6.technicalDuration}
              </li>
            </ul>
          </section>

          {/* Section 7: Your Rights */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section7.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section7.intro}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToAccess.title}</h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToAccess.description}</p>
              </div>
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToRectification.title}</h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToRectification.description}</p>
              </div>
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToErasure.title}</h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToErasure.description}</p>
              </div>
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToRestriction.title}</h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToRestriction.description}</p>
              </div>
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  {t.privacy.section7.rightToDataPortability.title}
                </h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToDataPortability.description}</p>
              </div>
              <div className="bg-background/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToObject.title}</h3>
                <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToObject.description}</p>
              </div>
            </div>

            <div className="mt-6 bg-primary/10 border border-primary/30 p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">{t.privacy.section7.rightToWithdraw.title}</h3>
              <p className="text-sm text-muted-foreground">{t.privacy.section7.rightToWithdraw.description}</p>
            </div>
          </section>

          {/* Section 8: Right to Complain */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section8.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section8.intro}</p>
            <address className="not-italic text-foreground bg-background/30 p-4 rounded-lg">
              <strong>{t.privacy.section8.authority}</strong>
              <br />
              {t.privacy.section8.address1}
              <br />
              {t.privacy.section8.address2}
              <br />
              {t.privacy.section8.phone}
              <br />
              E-Mail:{" "}
              <a href={`mailto:${t.privacy.section8.email}`} className="text-primary hover:underline">
                {t.privacy.section8.email}
              </a>
              <br />
              Website:{" "}
              <a
                href={`https://${t.privacy.section8.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t.privacy.section8.website}
              </a>
            </address>
          </section>

          {/* Section 9: Cookies */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section9.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section9.intro}</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>{t.privacy.section9.necessary.title}</strong> {t.privacy.section9.necessary.description}
              </li>
              <li>
                <strong>{t.privacy.section9.analytics.title}</strong> {t.privacy.section9.analytics.description}
              </li>
              <li>
                <strong>{t.privacy.section9.marketing.title}</strong> {t.privacy.section9.marketing.description}
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">{t.privacy.section9.settings}</p>
          </section>

          {/* Section 10: Data Security */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section10.title}</h2>
            <p className="text-muted-foreground">{t.privacy.section10.content}</p>
          </section>

          {/* Section 11: Changes */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section11.title}</h2>
            <p className="text-muted-foreground">{t.privacy.section11.content}</p>
          </section>

          {/* Section 12: Contact */}
          <section className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.privacy.section12.title}</h2>
            <p className="text-muted-foreground mb-4">{t.privacy.section12.intro}</p>
            <address className="not-italic text-foreground bg-background/30 p-4 rounded-lg">
              <strong>{t.privacy.section12.department}</strong>
              <br />
              {t.privacy.section12.name}
              <br />
              {t.privacy.section12.address1}
              <br />
              {t.privacy.section12.address2}
              <br />
              {t.privacy.section12.country}
              <br />
              <br />
              E-Mail:{" "}
              <a href={`mailto:${t.privacy.section12.email}`} className="text-primary hover:underline">
                {t.privacy.section12.email}
              </a>
            </address>
          </section>

          {/* Last Updated */}
          <div className="text-center text-muted-foreground text-sm pt-8 border-t border-border/30">
            <p>{t.privacy.lastUpdated}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
