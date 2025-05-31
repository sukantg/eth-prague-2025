import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Zap, Github, FileText, Twitter, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-800 transition-colors">
                How it Works
              </Link>
              <Link href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
                Features
              </Link>
              <Link href="#docs" className="text-slate-600 hover:text-slate-800 transition-colors">
                Docs
              </Link>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Connect Wallet
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Buy and sell second-hand goods —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600">
                with verified humans
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              Powered by World ID, NFTs, and smart contract escrow on Flow EVM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/seller-dashboard">
                <Button
                  size="lg"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Selling
                </Button>
              </Link>
              <Link href="/buyer-marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Browse Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Built for Trust & Security</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Revolutionary features that ensure every transaction is safe, transparent, and verified.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Smart Contract Escrow</h3>
                <p className="text-slate-600 leading-relaxed">
                  Funds are held securely in smart contracts until both parties confirm the transaction is complete.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">World ID Verification</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every user is verified as a unique human through World ID, eliminating bots and fake accounts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">NFT Ownership Proof</h3>
                <p className="text-slate-600 leading-relaxed">
                  Items are tokenized as NFTs, providing immutable proof of ownership and transaction history.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How Trust Bazaar Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and transparent trading in just a few steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Verify Your Identity</h3>
                    <p className="text-slate-600">
                      Connect your wallet and verify with World ID to prove you're a real human.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">List or Browse Items</h3>
                    <p className="text-slate-600">
                      Sellers create NFTs for their items, buyers browse verified listings from real people.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Transaction</h3>
                    <p className="text-slate-600">
                      Smart contracts hold funds in escrow until both parties confirm successful delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-100 to-emerald-100 rounded-3xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Shield className="h-12 w-12 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">100% Secure</h3>
                  <p className="text-slate-600">
                    Every transaction is protected by blockchain technology and verified human identities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Trade with Trust?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the future of decentralized commerce where every transaction is secure and every user is verified.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                The decentralized marketplace where trust meets technology. Buy and sell with confidence using verified
                identities and smart contracts.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/trust-bazaar"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </Link>
                <Link
                  href="https://twitter.com/trustbazaar"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link
                  href="https://discord.gg/trustbazaar"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="text-slate-600 hover:text-slate-800 transition-colors flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/whitepaper" className="text-slate-600 hover:text-slate-800 transition-colors">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-slate-600 hover:text-slate-800 transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-slate-600 hover:text-slate-800 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/trust-bazaar"
                    className="text-slate-600 hover:text-slate-800 transition-colors flex items-center"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-600 hover:text-slate-800 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-slate-600 hover:text-slate-800 transition-colors">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-600 hover:text-slate-800 transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-600">
              © {new Date().getFullYear()} Trust Bazaar. All rights reserved. Built on Flow EVM.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
