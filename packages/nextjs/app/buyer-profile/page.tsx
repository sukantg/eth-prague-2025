"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Edit, Mail, MapPin, User, X } from "lucide-react";
import { Textarea } from "~~/components/ui/textarea";

interface Profile {
  username: string;
  email: string;
  address: string;
}

export default function BuyerProfile() {
  const [profile, setProfile] = useState<Profile>({
    username: "Jane Smith",
    email: "jane@example.com",
    address: "123 Main St, Prague, Czech Republic",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<Profile>({
    username: "",
    email: "",
    address: "",
  });

  const handleEditProfile = () => {
    setEditProfileForm(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editProfileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)} />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative w-full max-w-2xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit Profile</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-lg font-semibold text-slate-900">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      value={editProfileForm.username}
                      onChange={e => setEditProfileForm({ ...editProfileForm, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold text-slate-900">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editProfileForm.email}
                      onChange={e => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-lg font-semibold text-slate-900">
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={editProfileForm.address}
                      onChange={e => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                      placeholder="Enter your delivery address"
                      required
                      rows={3}
                      className="text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-6 py-2 border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Buyer
              </Badge>
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Points Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Buyer Profile</h1>
              <p className="text-lg text-slate-700">Manage your account and delivery information</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-3xl font-bold text-slate-900">Verified</span>
                </div>
                <p className="text-base font-medium text-slate-700">Account Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span>Profile Information</span>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleEditProfile}
                  className="font-semibold text-slate-800 hover:text-slate-900 hover:bg-slate-50 border-slate-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-800">Username</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-slate-500" />
                      <p className="text-lg text-slate-900">{profile.username}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-800">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-slate-500" />
                      <p className="text-lg text-slate-900">{profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-800">Delivery Address</Label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-slate-500 mt-1" />
                      <p className="text-lg text-slate-900">{profile.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Status</h4>
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Verified Buyer</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">Your account is verified and ready to make purchases</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
