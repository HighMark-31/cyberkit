import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ChmodCalculator = () => {
  const [permissions, setPermissions] = useState({
    owner: { read: true, write: true, execute: false }, 
    group: { read: true, write: false, execute: false }, 
    public: { read: true, write: false, execute: false }, 
  });

  const [numeric, setNumeric] = useState('644');
  const [symbolic, setSymbolic] = useState('-rw-r--r--');

  const updateFromChecks = (newPerms: typeof permissions) => {
    setPermissions(newPerms);
    
    const calcDigit = (p: { read: boolean, write: boolean, execute: boolean }) => {
      return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
    };

    const o = calcDigit(newPerms.owner);
    const g = calcDigit(newPerms.group);
    const p = calcDigit(newPerms.public);
    
    setNumeric(`${o}${g}${p}`);

    const calcSymbol = (p: { read: boolean, write: boolean, execute: boolean }) => {
      return (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-');
    };

    setSymbolic(`-${calcSymbol(newPerms.owner)}${calcSymbol(newPerms.group)}${calcSymbol(newPerms.public)}`);
  };

  const handleCheck = (
    role: 'owner' | 'group' | 'public',
    type: 'read' | 'write' | 'execute',
    checked: boolean
  ) => {
    const newPerms = {
      ...permissions,
      [role]: {
        ...permissions[role],
        [type]: checked
      }
    };
    updateFromChecks(newPerms);
  };

  const handleNumericChange = (value: string) => {
    if (value.length > 3) return;
    setNumeric(value);
    
    if (value.length === 3) {
      const digits = value.split('').map(d => parseInt(d));
      if (digits.some(d => isNaN(d) || d < 0 || d > 7)) return;

      const getPerms = (digit: number) => ({
        read: (digit & 4) === 4,
        write: (digit & 2) === 2,
        execute: (digit & 1) === 1
      });

      const newPerms = {
        owner: getPerms(digits[0]),
        group: getPerms(digits[1]),
        public: getPerms(digits[2])
      };
      
      setPermissions(newPerms);
      
      const calcSymbol = (p: { read: boolean, write: boolean, execute: boolean }) => {
        return (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-');
      };
      setSymbolic(`-${calcSymbol(newPerms.owner)}${calcSymbol(newPerms.group)}${calcSymbol(newPerms.public)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Chmod Calculator</h1>
        <p className="text-muted-foreground">
          Visual permission calculator for Linux/Unix file systems
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Scope</TableHead>
                  <TableHead className="text-center">Read (4)</TableHead>
                  <TableHead className="text-center">Write (2)</TableHead>
                  <TableHead className="text-center">Execute (1)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(['owner', 'group', 'public'] as const).map((role) => (
                  <TableRow key={role} className="hover:bg-transparent">
                    <TableCell className="font-medium capitalize">{role}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permissions[role].read} 
                          onCheckedChange={(c) => handleCheck(role, 'read', c as boolean)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permissions[role].write} 
                          onCheckedChange={(c) => handleCheck(role, 'write', c as boolean)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={permissions[role].execute} 
                          onCheckedChange={(c) => handleCheck(role, 'execute', c as boolean)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="cyber-card flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label>Numeric Value (Octal)</Label>
              <Input 
                className="text-4xl font-mono h-16 text-center tracking-widest"
                value={numeric}
                onChange={(e) => handleNumericChange(e.target.value)}
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Symbolic Value</Label>
              <div className="text-4xl font-mono h-16 flex items-center justify-center bg-muted/30 rounded-md text-primary">
                {symbolic}
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              <p>Common permissions:</p>
              <div className="flex justify-center gap-4 mt-2">
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => handleNumericChange('777')}>777</button>
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => handleNumericChange('755')}>755</button>
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => handleNumericChange('644')}>644</button>
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => handleNumericChange('600')}>600</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
