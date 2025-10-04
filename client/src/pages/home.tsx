import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Shield, AlertTriangle, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Card className="mb-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
              <Target className="mr-3 h-8 w-8 text-blue-600" />
              Our Core Mission and Strategic Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our core mission is to assist people in achieving a better quality of life, defined by well-being, health, stability, and personal fulfillment. Our efforts—encompassing content marketing, content creation, business development, and strategic partnerships—will be guided by the following criteria.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-900 flex items-center">
              <HeartHandshake className="mr-3 h-7 w-7 text-green-600" />
              I. Prioritization for Promotion and Partnership (Positive Focus)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              We will actively promote/write contents and partner with businesses and entities that measurably contribute to enhancing quality of life through the following positive actions:
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Contents/Businesses/Entities that promote leisure activities:</strong>
                  <ul className="mt-2 ml-4 space-y-1 text-sm">
                    <li>• Adolescents (Ages 13–18): Identity and Stress Management</li>
                    <li>• Working Adults (Ages 19–65): Burnout Prevention and Perspective</li>
                    <li>• Seniors (Ages 65+): Cognitive Health and Purpose</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contents/Businesses/Entities that contribute to Positive Contribution and Impact:</strong> Purpose is abstract; contribution is tangible. Fulfillment is strengthened by the feeling that you are positively affecting others or making the world a slightly better place.
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contents/Businesses/Entities that contribute to a "safe environment":</strong> This encompasses more than just the absence of physical violence; it refers to a space—be it a neighborhood, workplace, school, or home—where an individual feels physically secure, emotionally supported, and protected from harm and exploitation.
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contents/Businesses/Entities that contribute/promote to stop:</strong> Animal Abuse, Child Abuse, Elder Abuse, Workplace Abuse, Institutional Abuse
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contents/Businesses/Entities that contribute/promote to stop:</strong> Emotional/Psychological Abuse, Sexual Abuse, Financial/Economic Abuse
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contents/Businesses/Entities that contribute/promote to create or maintain a safe environment,</strong> where conditions or culture don't threaten an individual's well-being, stability, or peace.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-xl border-0 bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-900 flex items-center">
              <Shield className="mr-3 h-7 w-7 text-red-600" />
              II. Prioritization for Accountability and Exposure (Negative Focus)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              Conversely, our efforts (content creations, business partnerships, etc.) will be leveraged to expose, degrade, and hold accountable businesses and entities that actively contribute to the degradation of quality of life.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Businesses/entities that contribute/fail to prevent:</strong> Emotional/Psychological Abuse, Sexual Abuse, Financial/Economic Abuse
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p>
                    <strong>Businesses/entities that contribute/fail to prevent Online Threats such as:</strong>
                  </p>
                  <p className="mt-2 text-sm">
                    Digital spaces (social media, platforms) that lack moderation against hate speech, threats, or aggressive misinformation. Stealing money, limiting access to bank/social media accounts, prohibiting the victim from working or attending school, forcing them to quit a job, incurring debt in the victim's name, or withholding funds needed for basic necessities like medication or food. Their goal is to ensure the victim's dependency by stripping them of the ability to support themselves financially.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Businesses/entities that contribute/fail to prevent:</strong> Child Abuse, Elder Abuse, Workplace Abuse, Institutional Abuse occurring within facilities (prisons, hospitals, residential schools) where residents are dependent on staff for basic care, often involving neglect, systemic dehumanization, or physical brutality.
                </p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Businesses/entities whose practices actively create or maintain unsafe environments,</strong> where conditions or culture threaten an individual's well-being, stability, or peace.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
