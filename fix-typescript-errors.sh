#!/bin/bash
# Script pour corriger les erreurs TypeScript restantes

echo "🔧 Correction des erreurs TypeScript..."

# Corriger les autres fichiers
sed -i 's/import React from '\''react'\'';//' src/components/dashboard/page/LandingPage.tsx
sed -i 's/import React from '\''react'\'';//' src/components/dashboard/page/UnderDevelopmentPage.tsx
sed -i 's/import React from '\''react'\'';//' src/components/dashboard/sidebar.tsx

# Corriger les imports avec hooks
sed -i 's/import React, { useState, useEffect }/import { useState, useEffect }/' src/components/dashboard/page/UsersPage.tsx
sed -i 's/import React, { useState, useEffect }/import { useState, useEffect }/' src/components/dashboard/page/UsersPageSimple.tsx
sed -i 's/import React, { useState, useEffect }/import { useState, useEffect }/' src/components/ui/AnnouncementBanner.tsx
sed -i 's/import React, { useState }/import { useState }/' src/components/ui/Header.tsx

# Corriger les imports inutilisés dans UsersPageSimple
sed -i 's/, User, Mail, Phone, Building, Search, Filter, Download/, Mail, Phone, Building, Search, Download/' src/components/dashboard/page/UsersPageSimple.tsx

# Corriger auth-service
sed -i 's/import { UserRole } from.*;//' src/lib/auth-service.ts
sed -i 's/LoginRequest, //; s/, OtpRequest//' src/lib/auth-service.ts

echo "✅ Corrections appliquées"