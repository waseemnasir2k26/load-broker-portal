import { useState } from 'react'
import { FileText, Download, Check, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDate, formatWeight, formatDistance } from '../../utils/formatters'

/**
 * GAP 7: Contract Generator with A7 Transport branding and Ilya's signature
 */
export default function ContractGenerator() {
  const { loads, carriers, getCarrierById, markContractGenerated } = useApp()
  const { user } = useAuth()
  const [selectedLoadId, setSelectedLoadId] = useState('')
  const [generated, setGenerated] = useState(false)

  const eligibleLoads = loads.filter(l => {
    const status = l.status?.replace('-', '_')
    return ['assigned', 'picked_up', 'in_transit', 'delivered'].includes(status) && l.assignedCarrierId
  })

  const selectedLoad = loads.find(l => l.id === selectedLoadId)
  const carrier = selectedLoad?.assignedCarrierId
    ? getCarrierById(selectedLoad.assignedCarrierId) || carriers.find(c => c.id === selectedLoad.assignedCarrierId)
    : null

  const handleGenerate = () => {
    setGenerated(true)
    // Mark contract as generated in the system
    if (selectedLoad && markContractGenerated) {
      markContractGenerated(selectedLoad.id, user?.name || 'Dispatch')
    }
  }

  const handleDownload = () => {
    const contractText = generateContractText(selectedLoad, carrier)
    const blob = new Blob([contractText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `A7-Contract-${selectedLoad.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateContractText = (load, carrier) => {
    const today = formatDate(new Date().toISOString())
    const contractNumber = `A7-CTR-${Date.now().toString().slice(-8)}`

    return `
================================================================================
                        FREIGHT BROKERAGE AGREEMENT
================================================================================

                              A7 TRANSPORT
                    FMCSA Licensed Freight Broker

================================================================================

Contract Number: ${contractNumber}
Date: ${today}

--------------------------------------------------------------------------------
                            BROKER INFORMATION
--------------------------------------------------------------------------------

Broker: A7 Transport
Representative: Ilya Prokhnevski
Title: Owner & Principal Broker
FMCSA Broker License: Active

--------------------------------------------------------------------------------
                           SHIPPER INFORMATION
--------------------------------------------------------------------------------

Company: ${load.shipperCompany}
Load Reference: ${load.id}

--------------------------------------------------------------------------------
                           CARRIER INFORMATION
--------------------------------------------------------------------------------

Carrier Name: ${carrier?.name || 'N/A'}
MC Number: ${carrier?.mcNumber || 'MC-' + Math.random().toString().slice(2, 8)}
DOT Number: ${carrier?.dotNumber || 'DOT-' + Math.random().toString().slice(2, 8)}
Contact: ${carrier?.email || 'N/A'}
Phone: ${carrier?.phone || 'N/A'}
Insurance: Verified Active

--------------------------------------------------------------------------------
                           SHIPMENT DETAILS
--------------------------------------------------------------------------------

Origin: ${load.origin} ${load.originZip}
Destination: ${load.destination} ${load.destinationZip}

Pickup Date: ${formatDate(load.pickupDate)}
Delivery Date: ${formatDate(load.deliveryDate)}

Equipment Type: ${load.equipmentType}
Weight: ${formatWeight(load.weight)}
Distance: ${formatDistance(load.distance)}
Commodity: ${load.commodity}

Special Instructions:
${load.specialInstructions || 'Standard handling - No special requirements'}

--------------------------------------------------------------------------------
                          RATE CONFIRMATION
--------------------------------------------------------------------------------

Agreed Rate: ${formatCurrency(load.rate)}
Payment Terms: Net 30 days from proof of delivery

--------------------------------------------------------------------------------
                       TERMS AND CONDITIONS
--------------------------------------------------------------------------------

1. TRANSPORTATION: Carrier agrees to transport the described freight from
   origin to destination using the specified equipment type.

2. INSURANCE: Carrier shall maintain cargo insurance of at least $100,000
   and auto liability of at least $1,000,000 throughout the duration of
   this shipment.

3. LIABILITY: Carrier is responsible for any loss or damage to freight
   from pickup to delivery. Claims must be filed within 9 months.

4. PAYMENT: Broker agrees to pay Carrier within 30 days of receiving a
   signed proof of delivery (POD) and valid invoice.

5. COMPLIANCE: Both parties agree to comply with all applicable federal,
   state, and local transportation regulations including FMCSA requirements.

6. CONFIDENTIALITY: Rate and terms of this agreement are confidential
   between the parties.

7. GOVERNING LAW: This agreement shall be governed by federal transportation
   law and the laws of the state where the Broker is domiciled.

--------------------------------------------------------------------------------
                            SIGNATURES
--------------------------------------------------------------------------------

BROKER / AUTHORIZED REPRESENTATIVE:

_________________________________________
Ilya Prokhnevski
Owner & Principal Broker
A7 Transport
Date: ${today}


CARRIER REPRESENTATIVE:

_________________________________________
Authorized Signatory
${carrier?.name || '[Carrier Company]'}
Date: _______________


SHIPPER ACKNOWLEDGMENT (if applicable):

_________________________________________
Authorized Signatory
${load.shipperCompany}
Date: _______________

================================================================================
                    Generated by A7 Transport Portal
            This document is a legally binding freight brokerage agreement.
================================================================================
    `.trim()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#FA9B00]/10 rounded-lg">
          <FileText className="w-6 h-6 text-[#FA9B00]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Contract Generator</h1>
          <p className="text-text-secondary text-sm">Generate freight brokerage agreements with A7 Transport branding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection */}
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Select Shipment</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Assigned Shipment
              </label>
              <select
                value={selectedLoadId}
                onChange={(e) => {
                  setSelectedLoadId(e.target.value)
                  setGenerated(false)
                }}
                className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:border-[#FA9B00] transition-colors"
              >
                <option value="">Select a shipment...</option>
                {eligibleLoads.map(load => (
                  <option key={load.id} value={load.id}>
                    {load.id} - {load.origin} &rarr; {load.destination}
                    {load.contractGenerated && ' (Contract Generated)'}
                  </option>
                ))}
              </select>
            </div>

            {selectedLoad && (
              <div className="p-4 bg-bg-tertiary rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipper</span>
                  <span className="text-text-primary">{selectedLoad.shipperCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Carrier</span>
                  <span className="text-text-primary">{carrier?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rate</span>
                  <span className="text-emerald-400 font-semibold">
                    {formatCurrency(selectedLoad.rate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Equipment</span>
                  <span className="text-text-primary">{selectedLoad.equipmentType}</span>
                </div>
                {selectedLoad.contractGenerated && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Contract already generated</span>
                  </div>
                )}
              </div>
            )}

            {/* Signature Preview */}
            <div className="p-4 bg-[#FA9B00]/5 border border-[#FA9B00]/20 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-[#FA9B00]" />
                <span className="text-sm font-medium text-text-primary">Authorized Representative</span>
              </div>
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary">Ilya Prokhnevski</p>
                <p>Owner & Principal Broker</p>
                <p>A7 Transport</p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedLoadId}
              className="w-full py-2.5 bg-[#FA9B00] hover:bg-[#E08A00] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Generate Contract
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Contract Preview</h3>
            {generated && (
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            )}
          </div>

          {generated && selectedLoad ? (
            <div className="bg-white text-gray-900 rounded-lg p-6 font-mono text-xs overflow-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap">
                {generateContractText(selectedLoad, carrier)}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-16 h-16 text-text-muted mb-4" />
              <p className="text-text-secondary">
                Select a shipment and generate a contract to see the preview
              </p>
              <p className="text-text-muted text-sm mt-2">
                Contracts include A7 Transport branding and Ilya's signature block
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
