"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Crown,
  Edit,
  Eye,
  Mail,
  MapPin,
  Palette,
  Phone,
  Ruler,
  Star,
} from "lucide-react";
import getRandomImage from "@/lib/randomImage.ts";

interface ProfileHeaderProps {
  profile: any;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card className="relative overflow-hidden bg-black/40 backdrop-blur-sm mb-8">
      {/* Cover Image */}
      <div className="h-48 relative">
        <Image
          src={profile?.cover_image || getRandomImage()}
          alt="Cover"
          fill
          className="object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="relative -mt-20 md:-mt-16">
            <div className="h-32 w-32 relative rounded-full overflow-hidden border-4 border-background">
              <Image
                src={profile?.profile_picture || getRandomImage()}
                alt={profile?.name || ""}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 ">
                  <span
                    className="truncate"
                    title={profile?.name || ""}
                  >
                    {profile?.name}
                  </span>
                  {profile?.current_plan == null && (
                    <Badge variant="secondary">
                      <Crown className="h-4 w-4 mr-1" />
                      VIP
                    </Badge>
                  )}
                </h1>
                <p
                  className="text-muted-foreground truncate"
                  title={profile?.about || ""}
                >
                  {profile?.about}
                </p>
              </div>

              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {profile?.location_name && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </div>
                  <p
                    className="font-medium truncate"
                    title={profile.location_name}
                  >
                    {profile.location_name}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-1" />
                  Contact
                </div>
                <p className="font-medium">
                  {profile?.phone_number || "Not Available"}
                </p>
              </div>
              {profile?.email && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground overflow-hidden">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </div>
                  <p className="font-medium truncate" title={profile.email}>
                    {profile.email}
                  </p>
                </div>
              )}
              {profile?.created_at && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member Since
                  </div>
                  <p className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Physical Attributes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {profile?.height && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Ruler className="h-4 w-4 mr-1" />
                    Height
                  </div>
                  <p className="font-medium">{profile.height}cm</p>
                </div>
              )}
              {profile?.eye_color && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    Eye Color
                  </div>
                  <p
                    className="font-medium truncate"
                    title={profile.eye_color}
                  >
                    {profile.eye_color}
                  </p>
                </div>
              )}
              {profile?.hair_color && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Palette className="h-4 w-4 mr-1" />
                    Hair Color
                  </div>
                  <p
                    className="font-medium truncate"
                    title={profile.hair_color}
                  >
                    {profile.hair_color}
                  </p>
                </div>
              )}
              {profile?.body_type && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    Body Type
                  </div>
                  <p
                    className="font-medium truncate"
                    title={profile.body_type}
                  >
                    {profile.body_type}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

