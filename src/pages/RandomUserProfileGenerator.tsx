
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RefreshCw, Download, User, Settings, FileText, Code, FileSpreadsheet, Users, Globe, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { UsageStats } from '@/components/UsageStats';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  occupation: string;
  company: string;
  salary: string;
  biography: string;
  avatar: string;
  socialMedia: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
  };
}

const RandomUserProfileGenerator = () => {
  const { trackAction } = useAnalytics({
    toolId: "random-user-profile-generator", 
    toolName: "Random User Profile Generator"
  });

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [outputFormat, setOutputFormat] = useState('json');
  const [selectedGender, setSelectedGender] = useState('random');
  const [selectedNationality, setSelectedNationality] = useState('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualOverrides, setManualOverrides] = useState({
    firstName: '',
    lastName: '',
    email: '',
    occupation: '',
    company: ''
  });
  const { toast } = useToast();

  const genders = ['male', 'female'];
  const nationalities = [
    'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Italian', 'Spanish',
    'Japanese', 'Korean', 'Chinese', 'Indian', 'Brazilian', 'Mexican', 'Russian', 'Dutch',
    'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Irish', 'Scottish', 'Welsh', 'Polish'
  ];

  const outputFormats = [
    { value: 'json', label: 'JSON', icon: Code, description: 'JavaScript Object Notation' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma Separated Values' },
    { value: 'xml', label: 'XML', icon: Code, description: 'Extensible Markup Language' },
    { value: 'txt', label: 'TXT', icon: FileText, description: 'Plain Text Format' }
  ];

  const firstNames = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Margaret']
  };

  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const occupations = ['Software Engineer', 'Teacher', 'Doctor', 'Nurse', 'Manager', 'Designer', 'Artist', 'Writer', 'Chef', 'Mechanic', 'Lawyer', 'Accountant', 'Marketing Specialist', 'Sales Representative', 'Consultant', 'Architect', 'Photographer', 'Musician', 'Therapist', 'Engineer'];

  const companies = ['TechCorp', 'InnovateLab', 'GlobalSoft', 'FutureTech', 'CreativeStudio', 'DataDynamics', 'CloudWorks', 'DigitalForge', 'SmartSolutions', 'NextGen Industries', 'ProActive Systems', 'BrightFuture Inc', 'Elite Enterprises', 'Premier Solutions', 'Advanced Technologies'];

  const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const generateEmail = (firstName: string, lastName: string) => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const variations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}@${domain}`
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  };

  const generatePhone = () => {
    return `+1 (${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
  };

  const generateAddress = () => {
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave', 'Broadway', 'Washington St', 'Lincoln Ave'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const states = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA'];
    
    return {
      street: `${Math.floor(Math.random() * 9999 + 1)} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      postalCode: Math.floor(Math.random() * 90000 + 10000).toString(),
      country: 'United States'
    };
  };

  const generateBiography = (firstName: string, occupation: string) => {
    const hobbies = ['reading', 'traveling', 'photography', 'cooking', 'hiking', 'music', 'art', 'sports', 'gaming', 'gardening'];
    const selectedHobbies = hobbies.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    return `${firstName} is a passionate ${occupation.toLowerCase()} with a love for ${selectedHobbies.join(' and ')}. With years of experience in their field, they bring creativity and dedication to everything they do. In their free time, ${firstName} enjoys exploring new places and connecting with like-minded individuals.`;
  };

  const generateAvatar = (gender: string) => {
    const avatarId = Math.floor(Math.random() * 1000);
    return `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${avatarId % 100}.jpg`;
  };

  const generateProfile = (): UserProfile => {
    const gender = selectedGender === 'random' ? genders[Math.floor(Math.random() * genders.length)] : selectedGender;
    const nationality = selectedNationality === 'random' ? nationalities[Math.floor(Math.random() * nationalities.length)] : selectedNationality;
    
    const firstName = manualOverrides.firstName || firstNames[gender as keyof typeof firstNames][Math.floor(Math.random() * firstNames[gender as keyof typeof firstNames].length)];
    const lastName = manualOverrides.lastName || lastNames[Math.floor(Math.random() * lastNames.length)];
    const occupation = manualOverrides.occupation || occupations[Math.floor(Math.random() * occupations.length)];
    const company = manualOverrides.company || companies[Math.floor(Math.random() * companies.length)];
    
    const dateOfBirth = generateRandomDate(new Date(1960, 0, 1), new Date(2000, 11, 31));
    
    return {
      firstName,
      lastName,
      email: manualOverrides.email || generateEmail(firstName, lastName),
      phone: generatePhone(),
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      gender,
      nationality,
      address: generateAddress(),
      occupation,
      company,
      salary: `$${(Math.floor(Math.random() * 150) + 30) * 1000}`,
      biography: generateBiography(firstName, occupation),
      avatar: generateAvatar(gender),
      socialMedia: {
        twitter: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        instagram: `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`
      },
      preferences: {
        language: 'English',
        timezone: 'UTC-5',
        currency: 'USD'
      }
    };
  };

  const generateProfiles = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newProfiles: UserProfile[] = [];
      
      for (let i = 0; i < quantity; i++) {
        newProfiles.push(generateProfile());
      }
        setProfiles(newProfiles);
      setIsGenerating(false);
      
      // Track profile generation
      trackAction('generate');
      
      toast({
        title: "✅ Generation Complete",
        description: `Successfully generated ${quantity} user profile${quantity > 1 ? 's' : ''}!`,
      });
    }, 1000);
  };

  const generateOutputData = (format: string): string => {
    switch (format) {
      case 'csv':
        const csvHeader = 'First Name,Last Name,Email,Phone,Date of Birth,Gender,Nationality,Street,City,State,Postal Code,Country,Occupation,Company,Salary,Biography,Avatar,Twitter,LinkedIn,Instagram,Language,Timezone,Currency\n';
        const csvData = profiles.map(profile => 
          `"${profile.firstName}","${profile.lastName}","${profile.email}","${profile.phone}","${profile.dateOfBirth}","${profile.gender}","${profile.nationality}","${profile.address.street}","${profile.address.city}","${profile.address.state}","${profile.address.postalCode}","${profile.address.country}","${profile.occupation}","${profile.company}","${profile.salary}","${profile.biography}","${profile.avatar}","${profile.socialMedia.twitter}","${profile.socialMedia.linkedin}","${profile.socialMedia.instagram}","${profile.preferences.language}","${profile.preferences.timezone}","${profile.preferences.currency}"`
        ).join('\n');
        return csvHeader + csvData;
      
      case 'xml':
        const xmlData = profiles.map(profile => `
  <profile>
    <personal>
      <firstName>${profile.firstName}</firstName>
      <lastName>${profile.lastName}</lastName>
      <email>${profile.email}</email>
      <phone>${profile.phone}</phone>
      <dateOfBirth>${profile.dateOfBirth}</dateOfBirth>
      <gender>${profile.gender}</gender>
      <nationality>${profile.nationality}</nationality>
    </personal>
    <address>
      <street>${profile.address.street}</street>
      <city>${profile.address.city}</city>
      <state>${profile.address.state}</state>
      <postalCode>${profile.address.postalCode}</postalCode>
      <country>${profile.address.country}</country>
    </address>
    <professional>
      <occupation>${profile.occupation}</occupation>
      <company>${profile.company}</company>
      <salary>${profile.salary}</salary>
    </professional>
    <biography>${profile.biography}</biography>
    <avatar>${profile.avatar}</avatar>
    <socialMedia>
      <twitter>${profile.socialMedia.twitter}</twitter>
      <linkedin>${profile.socialMedia.linkedin}</linkedin>
      <instagram>${profile.socialMedia.instagram}</instagram>
    </socialMedia>
    <preferences>
      <language>${profile.preferences.language}</language>
      <timezone>${profile.preferences.timezone}</timezone>
      <currency>${profile.preferences.currency}</currency>
    </preferences>
  </profile>`).join('');
        return `<?xml version="1.0" encoding="UTF-8"?>\n<profiles>${xmlData}\n</profiles>`;
      
      case 'txt':
        return profiles.map((profile, index) => `
Profile #${index + 1}
===============
Name: ${profile.firstName} ${profile.lastName}
Email: ${profile.email}
Phone: ${profile.phone}
Date of Birth: ${profile.dateOfBirth}
Gender: ${profile.gender}
Nationality: ${profile.nationality}

Address:
${profile.address.street}
${profile.address.city}, ${profile.address.state} ${profile.address.postalCode}
${profile.address.country}

Professional:
Occupation: ${profile.occupation}
Company: ${profile.company}
Salary: ${profile.salary}

Biography:
${profile.biography}

Social Media:
Twitter: ${profile.socialMedia.twitter}
LinkedIn: ${profile.socialMedia.linkedin}
Instagram: ${profile.socialMedia.instagram}

Preferences:
Language: ${profile.preferences.language}
Timezone: ${profile.preferences.timezone}
Currency: ${profile.preferences.currency}

Avatar: ${profile.avatar}
`).join('\n');
      
      case 'json':
      default:
        return JSON.stringify(profiles, null, 2);
    }
  };
  const copyOutputData = () => {
    const outputData = generateOutputData(outputFormat);
    navigator.clipboard.writeText(outputData);
    
    // Track copy action
    trackAction('copy');
    
    toast({
      title: "📋 Copied",
      description: `${outputFormat.toUpperCase()} data copied to clipboard!`,
    });
  };

  const downloadData = () => {
    const data = generateOutputData(outputFormat);
    const blob = new Blob([data], { type: getContentType(outputFormat) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;    link.download = `user-profiles.${outputFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Track download action
    trackAction('download');
    
    toast({
      title: "📥 Download Complete",
      description: `User profiles downloaded as ${outputFormat.toUpperCase()}!`,
    });
  };

  const getContentType = (format: string): string => {
    const types = {
      json: 'application/json',
      csv: 'text/csv',
      xml: 'application/xml',
      txt: 'text/plain'
    };
    return types[format as keyof typeof types] || 'text/plain';
  };

  const clearProfiles = () => {
    setProfiles([]);
    toast({
      title: "🗑️ Cleared",
      description: "All generated profiles have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Random User Profile Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate realistic user profiles for testing, development, and design purposes
          </p>
        </div>

        {/* Warning Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <TriangleAlert className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-semibold">Important:</span> All generated profiles are completely fictional and created for testing purposes only. 
            Do not use this data for any real-world applications, fraud, or illegal activities. Please use responsibly.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-4">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Configuration</CardTitle>
                    <CardDescription className="text-gray-600">Customize profile generation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity (1-25)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(25, Number(e.target.value))))}
                    min="1"
                    max="25"
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender Preference
                  </Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="random">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>🎲 Random</span>
                        </div>
                      </SelectItem>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          <span className="capitalize">{gender}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                    Nationality
                  </Label>
                  <Select value={selectedNationality} onValueChange={setSelectedNationality}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                      <SelectItem value="random">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>🌍 Random</span>
                        </div>
                      </SelectItem>
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality} value={nationality}>
                          <span>{nationality}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Manual Overrides */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800">Manual Overrides</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">First Name</Label>
                      <Input
                        placeholder="Auto-generate"
                        value={manualOverrides.firstName}
                        onChange={(e) => setManualOverrides(prev => ({ ...prev, firstName: e.target.value }))}
                        className="h-9 text-sm bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Last Name</Label>
                      <Input
                        placeholder="Auto-generate"
                        value={manualOverrides.lastName}
                        onChange={(e) => setManualOverrides(prev => ({ ...prev, lastName: e.target.value }))}
                        className="h-9 text-sm bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Email</Label>
                    <Input
                      placeholder="Auto-generate"
                      value={manualOverrides.email}
                      onChange={(e) => setManualOverrides(prev => ({ ...prev, email: e.target.value }))}
                      className="h-9 text-sm bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Occupation</Label>
                    <Input
                      placeholder="Auto-generate"
                      value={manualOverrides.occupation}
                      onChange={(e) => setManualOverrides(prev => ({ ...prev, occupation: e.target.value }))}
                      className="h-9 text-sm bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Company</Label>
                    <Input
                      placeholder="Auto-generate"
                      value={manualOverrides.company}
                      onChange={(e) => setManualOverrides(prev => ({ ...prev, company: e.target.value }))}
                      className="h-9 text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="outputFormat" className="text-sm font-medium text-gray-700">
                    Output Format
                  </Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-400">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      {outputFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center space-x-3">
                            <format.icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    onClick={generateProfiles}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 mr-3" />
                        Generate Profiles
                      </>
                    )}
                  </Button>

                  {profiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={copyOutputData}
                        variant="outline"
                        size="sm"
                        className="h-10 border-blue-200 hover:bg-blue-50 text-blue-600"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadData}
                        variant="outline"
                        size="sm"
                        className="h-10 border-green-200 hover:bg-green-50 text-green-600"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        onClick={clearProfiles}
                        variant="outline"
                        size="sm"
                        className="h-10 border-red-200 hover:bg-red-50 text-red-600"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Display */}
          <div className="lg:col-span-8">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-800">Generated Output</CardTitle>
                    <CardDescription className="text-gray-600">
                      {profiles.length > 0 ? `${profiles.length} profile${profiles.length > 1 ? 's' : ''} in ${outputFormat.toUpperCase()} format` : 'Configure settings and generate profiles'}
                    </CardDescription>
                  </div>
                  {profiles.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Format: {outputFormat.toUpperCase()}</div>
                      <div className="text-2xl font-bold text-blue-600">{profiles.length}</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {profiles.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Profiles Generated</h3>
                    <p className="text-gray-500">Configure your settings and click generate to create user profiles</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Output ({outputFormat.toUpperCase()})
                      </h3>
                      <div className="flex space-x-2">
                        {outputFormats.map((format) => (
                          <Button
                            key={format.value}
                            onClick={() => setOutputFormat(format.value)}
                            variant={outputFormat === format.value ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                          >
                            <format.icon className="w-3 h-3 mr-1" />
                            {format.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                        {generateOutputData(outputFormat)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Preview Cards */}
            {profiles.length > 0 && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Profile Preview</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.slice(0, 6).map((profile, index) => (
                    <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-800">{profile.firstName} {profile.lastName}</h4>
                            <p className="text-sm text-gray-600">{profile.occupation}</p>
                            <p className="text-xs text-gray-500">{profile.company}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Email:</span> {profile.email}</p>
                          <p><span className="font-medium">Phone:</span> {profile.phone}</p>
                          <p><span className="font-medium">Location:</span> {profile.address.city}, {profile.address.state}</p>
                          <p><span className="font-medium">Salary:</span> {profile.salary}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {profiles.length > 6 && (
                  <p className="text-center text-gray-600">
                    Showing 6 of {profiles.length} profiles. View all in the output above.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Usage Info */}
        <Card className="mt-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Complete User Profile Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">🎯 Comprehensive Data</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Personal & contact information</li>
                  <li>• Complete address details</li>
                  <li>• Professional background</li>
                  <li>• Social media profiles</li>
                  <li>• Biographical information</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">⚙️ Flexible Options</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Gender & nationality selection</li>
                  <li>• Manual field overrides</li>
                  <li>• Bulk generation (1-25 profiles)</li>
                  <li>• Multiple export formats</li>
                  <li>• Real-time preview</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">🔧 Perfect For</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• UI/UX testing & prototyping</li>
                  <li>• Database population</li>
                  <li>• Software development</li>
                  <li>• Educational demonstrations</li>
                  <li>• Design presentations</li>
                </ul>              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Usage Statistics */}
        <UsageStats toolId="random-user-profile-generator" />
      </div>
    </div>
  );
};

export default RandomUserProfileGenerator;
